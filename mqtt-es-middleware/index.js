/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
require('dotenv').config();

const mqtt = require('mqtt');
const axios = require('axios').default;
const moment = require('moment-timezone');
const { Client } = require('@elastic/elasticsearch');

const status = {};

function diffInMins(startDate, endDate) {
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    return (diff / 60000);
}

async function sendEmail(type, condition, config, body) {
    console.log('Sending Email', type, condition, moment(body.TM).tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm A'), moment().tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm A'));
    await axios.post(`${process.env.API_URI}/mail-settings/sendEmail`, {
        type,
        condition,
        PV01: body.PV01,
        PV02: body.PV02,
        loc: body.LOC,
        uid: body.UID,
        ts: moment(body.TM).tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm A'),
        maxTemp: config.maxTemp,
        minTemp: config.minTemp,
        maxHumidity: config.maxHumidity,
        minHumidity: config.minHumidity,
    });
}

async function main() {
    const esClient = new Client({
        node: process.env.ES_URI,
    });

    try {
        await esClient.indices.getMapping({ index: process.env.ES_INDEX });
    } catch (err) {
        await esClient.indices.create({
            index: process.env.ES_INDEX,
            body: {
                mappings: {
                    properties: {
                        LOC: {
                            type: 'keyword',
                        },
                        PV01: {
                            type: 'integer',
                        },
                        PV02: {
                            type: 'integer',
                        },
                        RSSI: {
                            type: 'integer',
                        },
                        TM: {
                            type: 'date',
                        },
                        UID: {
                            type: 'keyword',
                        },
                    },
                },
            },
        });
    }

    const client = mqtt.connect(process.env.MQTT_HOST, {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        port: process.env.MQTT_PORT ? Number.parseInt(process.env.MQTT_PORT, 10) : 1883,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
        clean: true,
    });

    client.on('connect', () => {
        client.subscribe(process.env.MQTT_TOPICS.split(',').map((x) => x.trim()).filter((x) => x), (err) => {
            if (!err) {
                console.log('Connected!'); // eslint-disable-line no-console
            } else {
                console.log(err); // eslint-disable-line no-console
            }
        });
    });

    client.on('message', async (topic, message) => {
        const body = JSON.parse(message.toString());
        const temp = body.TM;
        body.TM = moment()
            .tz('Asia/Kolkata')
            .set({
                year: parseInt(`20${body.TM.slice(0, 2)}`, 10),
                month: parseInt(body.TM.slice(2, 4), 10) - 1,
                date: parseInt(body.TM.slice(4, 6), 10),
                hour: parseInt(body.TM.slice(6, 8), 10),
                minute: parseInt(body.TM.slice(8, 10), 10) + 1,
                second: 0,
            })
            .valueOf();

        console.log(
            temp,
            moment(body.TM).tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm A'),
            moment().tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm A'),
        );

        body.PV01 = parseInt(body.PV01, 10) / 10;
        body.PV02 = parseInt(body.PV02, 10) / 10;
        body.RSSI = parseInt(body.RSSI, 10);

        await esClient.index({
            index: process.env.ES_INDEX,
            body,
        });

        if (!status[body.UID]) {
            status[body.UID] = {
                temp: null,
                humidity: null,
            };
        }

        let config;
        try {
            const { data } = await axios.get(`${process.env.API_URI}/devices`);
            if (data) {
                const device = data.find((d) => d.uid === body.UID);
                if (device) {
                    config = device.configuration;
                }
            }
        } catch (e) {
            console.log('No Config!');
        }

        if (config) {
            if (config.alertForTemp) {
                const tempCondition = body.PV01 <= config.minTemp
                    ? 'Low'
                    : body.PV01 >= config.maxTemp
                        ? 'High'
                        : 'Neutral';

                console.log('Temperature', tempCondition);

                if (['High', 'Low'].includes(tempCondition)) {
                    if (
                        status[body.UID].temp === null
                        || diffInMins(status[body.UID].temp, body.TM) > config.alertInterval
                    ) {
                        status[body.UID].temp = body.TM;
                        await sendEmail('Temperature', tempCondition, config, body);
                    }
                } else if (status[body.UID].temp !== null) {
                    status[body.UID].temp = null;
                    await sendEmail('Temperature', tempCondition, config, body);
                }
            }

            if (config.alertForHumidity) {
                const humidityCondition = body.PV02 <= config.minHumidity
                    ? 'Low'
                    : body.PV02 >= config.maxHumidity
                        ? 'High'
                        : 'Neutral';

                console.log('Humidity', humidityCondition);

                if (['High', 'Low'].includes(humidityCondition)) {
                    if (
                        status[body.UID].humidity === null
                        || diffInMins(status[body.UID].humidity, body.TM) > config.alertInterval
                    ) {
                        status[body.UID].humidity = body.TM;
                        await sendEmail('Humidity', humidityCondition, config, body);
                    }
                } else if (status[body.UID].humidity !== null) {
                    status[body.UID].humidity = null;
                    await sendEmail('Humidity', humidityCondition, config, body);
                }
            }
        }
    });

    client.on('offline', () => {
        client.end(true, main);
    });
}

main();
