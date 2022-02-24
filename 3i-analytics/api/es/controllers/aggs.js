const { Client } = require('@elastic/elasticsearch');
const { parse } = require('json2csv');
const moment = require('moment-timezone');
const pdf = require('html-pdf');
const xlsx = require('node-xlsx');

const template = require('./templates');

const pdfCreator = (content) => new Promise((resolve, reject) => {
    pdf.create(content, { format: 'A4' }).toBuffer((err, buffer) => {
        if (err) return reject(err);
        resolve(buffer);
    });
});

module.exports = {
    async index(ctx) {
        let {
            page,
            size,
            order,
            uid,
        } = ctx.request.query;

        if (!page) page = 0;
        else page = Number.parseInt(page, 10);

        if (!size) size = 10;
        else size = Number.parseInt(size, 10);

        if (!order) order = [{ TM: 'desc' }];
        else order = order.map((o) => {
            const { id, direction } = JSON.parse(o);
            return { [id]: direction };
        });

        const devices = await strapi.query('device').find();
        const device = devices.find((d) => d.uid === uid);

        if (!device) {
            return { success: false };
        }

        const client = new Client({
            node: process.env.ES_URI,
            auth: {
                username: 'elastic',
                password: 'mongoose'
            }
        });
        const { body } = await client.search({
            index: process.env.ES_INDEX,
            body: {
                query: {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "TM": {
                                        "gte": moment().tz('Asia/Calcutta').startOf('day'),
                                        "lte": moment().tz('Asia/Calcutta').endOf('day'),
                                    }
                                }
                            },
                            {
                                "term": {
                                    "UID": {
                                        "value": uid
                                    }
                                }
                            }
                        ]
                    }
                },
                sort: order,
                size: size,
                from: page * size,
            }
        });

        const { body: count } = await client.count({
            index: process.env.ES_INDEX,
            body: {
                query: {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "TM": {
                                        "gte": moment().tz('Asia/Calcutta').startOf('day'),
                                        "lte": moment().tz('Asia/Calcutta').endOf('day'),
                                    }
                                }
                            },
                            {
                                "term": {
                                    "UID": {
                                        "value": uid
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        });

        return {
            success: true,
            value: body.hits.hits.map(hit => ({
                PV01: hit._source.PV01,
                PV02: hit._source.PV02,
                LOC: device.name,
                UID: device.uid,
                TM: hit._source.TM
            })),
            pageInfo: {
                page,
                size,
                totalCount: count.count,
                totalPages: Math.ceil(count.count / size),
            }
        };
    },
    async reports(ctx) {
        let {
            start,
            end,
            uid,
            fileType,
        } = ctx.request.query;

        if (!start || !end) {
            return {
                success: false,
                error: 'Start and End date, both are required!'
            };
        }

        start = moment(start).tz('Asia/Calcutta').valueOf();
        end = moment(end).tz('Asia/Calcutta').valueOf();

        const devices = await strapi.query('device').find();
        const device = devices.find((d) => d.uid === uid);

        if (!device) {
            return {
                success: false,
                error: 'Device UID is missing!'
            };
        }
        
        const client = new Client({
            node: process.env.ES_URI,
        });
        const data = [];
        const search = await client.search({
            index: process.env.ES_INDEX,
            scroll: '10s',
            body: {
                "sort": {
                    "TM": 'asc'
                },
                "query": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "TM": {
                                        "gte": start,
                                        "lte": end,
                                    }
                                }
                            },
                            {
                                "term": {
                                    "UID": {
                                        "value": uid
                                    }
                                }
                            }
                        ]
                    }
                },
            }
        });
        let { body: { _scroll_id, hits } } = search;

        while(hits && hits.hits.length) {
            data.push(...hits.hits.map(hit => {
                hit._source.TM = moment(hit._source.TM).tz('Asia/Calcutta').format('DD/MM/YYYY hh:mm A');
                return {
                    TM: hit._source.TM,
                    name: device.name,
                    PV01: hit._source.PV01,
                    PV02: hit._source.PV02
                }
            }));
        
            const { body: { _scroll_id: scrollId, hits: fetchedData } } = await client.scroll({
                scrollId: _scroll_id,
                scroll: '10s'
            });
            _scroll_id = scrollId;
            hits = fetchedData;
        }

        const formatStartDate = moment(start).tz('Asia/Calcutta').format('DD-MM-YYYY');
        const formatEndDate = moment(end).tz('Asia/Calcutta').format('DD-MM-YYYY');

        if (fileType === 'pdf') {
            const html = template(data, formatStartDate, formatEndDate);

            const buffer = await pdfCreator(html);

            ctx.set('Content-Type', 'application/pdf; charset=utf-8');
            ctx.set('Content-Disposition', 'attachment; filename=reports.pdf');
            ctx.body = buffer;
            return ctx;
        }

        if (fileType === 'xlsx') {
            ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            ctx.set('Content-Disposition: attachment; filename=reports.xlsx');

            const buffer = xlsx.build([
                {
                    name: `${ data[0].name }`,
                    data: [
                        [`${ data[0].name } Temperature and Humidity Report ${ formatStartDate } - ${ formatEndDate }`],
                        [],
                        ['Date', 'Device Name', 'Temperature', 'Humidity'],
                        ...data.map(x => ([
                            x.TM,
                            x.name,
                            x.PV01,
                            x.PV02
                        ])),
                    ],
                }
            ]);
            
            ctx.body = buffer;
            return ctx;
        }

        ctx.set('Content-Type', 'text/csv; charset=utf-8');
        ctx.set('Content-Disposition: attachment; filename=reports.csv');
        ctx.body = parse(data, {
            delimiter: ',',
            fields: [
                {
                    label: 'Time',
                    value: 'TM'
                },
                {
                    label: 'Device Name',
                    value: 'name'
                },
                {
                    label: 'Temperature',
                    value: 'PV01'
                },
                {
                    label: 'Humidity',
                    value: 'PV02'
                },
            ]
        });

        return ctx;
    },
    async aggs(ctx) {
        let {
            start,
            end,
            uid,
        } = ctx.request.body;

        if (!start || !end) {
            return {
                success: false,
                error: 'Start and End date, both are required!'
            };
        }

        start = moment(start).tz('Asia/Calcutta').valueOf();
        end = moment(end).tz('Asia/Calcutta').valueOf();

        const devices = await strapi.query('device').find();
        const device = devices.find((d) => d.uid === uid);

        if (!device) {
            return { success: true };
        }

        const client = new Client({
            node: process.env.ES_URI,
            auth: {
                username: 'elastic',
                password: 'mongoose'
            }
        });

        const finalValue = {};

        const { body } = await client.search({
            index: process.env.ES_INDEX,
            body: {
                "size": 1,
                "sort": [
                    {
                        "TM": "desc",
                    }
                ],
                "query": {
                    "bool": {
                        "must": [
                            {
                                "term": {
                                    "UID": {
                                        "value": uid
                                    }
                                }
                            }
                        ]
                    }
                },
            }
        });

        if (!body) {
            return {
                success: false,
                error: 'Failed to aggregate!'
            };
        }

        finalValue.current = body.hits.hits.map((x) => ({ _id: x._id, ...x._source }))[0];

        const { body: avgByDevices } = await client.search({
            index: process.env.ES_INDEX,
            body: {
                "size": 0,
                "query": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "TM": {
                                        "gte": start,
                                        "lte": end,
                                    }
                                }
                            },
                            {
                                "term": {
                                    "UID": {
                                        "value": uid
                                    }
                                }
                            }
                        ]
                    }
                },
                "aggs": {
                    "UID": {
                        "terms": {
                            "field": "UID"
                        },
                        "aggs": {
                            "fiveMinAvg": {
                                "date_histogram": {
                                    "field": "TM",
                                    "fixed_interval": '30m',
                                },
                                "aggs": {
                                    "TM": {
                                        "max": {
                                            "field": "TM"
                                        }
                                    }
                                }
                            },
                        }
                    },
                }
            }
        });
        finalValue.avgByDevices = avgByDevices.aggregations;
        finalValue.avgByDevices.UID.buckets[0].fiveMinAvg.buckets = finalValue.avgByDevices.UID.buckets[0].fiveMinAvg.buckets
            .map((bucket) => {
                if (bucket.doc_count === 0) {
                    return {
                        ...bucket,
                        Temperature: { value: 0 },
                        Humidity: { value: 0 },
                    }
                }
                return bucket;
            });

        if (finalValue.avgByDevices.UID.buckets.length > 0) {
            const values = finalValue.avgByDevices.UID.buckets[0].fiveMinAvg.buckets.map(b => b.TM.value).filter(x => x);
            const { body: tsBody } = await client.search({
                index: process.env.ES_INDEX,
                body: {
                    size: values.length,
                    _source: ['TM', 'PV01', 'PV02'],
                    query: {
                        bool: {
                            must: [
                                {
                                    term: {
                                        'UID': {
                                            value: uid
                                        }
                                    }
                                },
                                {
                                    terms: {
                                        TM: values
                                    }
                                }
                            ]
                        }
                    }
                }
            });
            
            tsBody.hits.hits.map(hit => {
                const index = finalValue.avgByDevices.UID.buckets[0].fiveMinAvg.buckets.findIndex(x => x.TM.value === hit._source.TM);
                finalValue.avgByDevices.UID.buckets[0].fiveMinAvg.buckets[index].Temperature = { value: hit._source.PV01 };
                finalValue.avgByDevices.UID.buckets[0].fiveMinAvg.buckets[index].Humidity = { value: hit._source.PV02 };
            });

            finalValue.avgByDevices.UID.buckets[0].fiveMinAvg.buckets.forEach(bucket => {
                if (bucket.TM) {
                    delete bucket.TM
                }
            });
        }

        const { body: avgTempVsHumidity } = await client.search({
            index: process.env.ES_INDEX,
            body: {
                "size": 0,
                "query": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "TM": {
                                        "gte": start,
                                        "lte": end,
                                    }
                                }
                            },
                            {
                                "term": {
                                    "UID": {
                                        "value": uid
                                    }
                                }
                            }
                        ]
                    }
                },
                "aggs": {
                    "TempVsHumidity": {
                        "date_histogram": {
                            "field": "TM",
                            "fixed_interval": '30m',
                        },
                        "aggs": {
                            "TM": {
                                "max": {
                                    "field": "TM"
                                }
                            },
                        }
                    },
                }
            }
        });

        finalValue.avgTempVsHumidity = avgTempVsHumidity.aggregations;
        finalValue.avgTempVsHumidity.TempVsHumidity.buckets = finalValue.avgTempVsHumidity.TempVsHumidity.buckets
            .map((bucket) => {
                if (bucket.doc_count === 0) {
                    return {
                        ...bucket,
                        Temperature: { value: 0 },
                        Humidity: { value: 0 },
                    }
                }
                return bucket;
            });

        if (finalValue.avgTempVsHumidity.TempVsHumidity.buckets.length > 0) {
            const values = finalValue.avgTempVsHumidity.TempVsHumidity.buckets.map(b => b.TM.value).filter(x => x);
            const { body: tsBody } = await client.search({
                index: process.env.ES_INDEX,
                body: {
                    size: values.length,
                    _source: ['TM', 'PV01', 'PV02'],
                    query: {
                        bool: {
                            must: [
                                {
                                    term: {
                                        'UID': {
                                            value: uid
                                        }
                                    }
                                },
                                {
                                    terms: {
                                        TM: values
                                    }
                                }
                            ]
                        }
                    }
                }
            });
            
            tsBody.hits.hits.map(hit => {
                const index = finalValue.avgTempVsHumidity.TempVsHumidity.buckets.findIndex(x => x.TM.value === hit._source.TM);
                finalValue.avgTempVsHumidity.TempVsHumidity.buckets[index].Temperature = { value: hit._source.PV01 };
                finalValue.avgTempVsHumidity.TempVsHumidity.buckets[index].Humidity = { value: hit._source.PV02 };
            });

            finalValue.avgTempVsHumidity.TempVsHumidity.buckets.forEach(bucket => {
                if (bucket.TM) {
                    delete bucket.TM
                }
            });
        }

        return {
            success: true,
            value: finalValue,
        }
    },
}