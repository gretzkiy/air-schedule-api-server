const express = require('express');
const axios = require('axios');
const logger = require('./modules/logger');

const PORT = process.env.PORT || 4000;
const { API_TOKEN } = process.env;
if (!API_TOKEN) {
    console.log('API_TOKEN must be specified.');
    process.exit(1);
}

const app = express();

const acceptedSchheduleEvents = [
    'departure',
    'arrival',
];

// eslint-disable-next-line consistent-return
app.use('/api', (request, response) => {
    logger({
        event: 'Received request',
        msg: request,
    });
    const { event } = request.query;

    if (!acceptedSchheduleEvents.includes(event)) {
        logger({
            event: 'Request query parsing error',
            msg: `Invalid event value. Got ${event}`,
        });

        return response
            .status(400)
            .json({
                status: 400,
                error: true,
                message: `Schedule event must be: ${acceptedSchheduleEvents.join(' or ')}. Got ${event}.`,
            });
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const url = `https://api.rasp.yandex.net/v3.0/schedule/?\
station=svo&lang=ru_RU\
&format=json\
&transport_types=plane\
&system=iata\
&date=${today}\
&event=${event}\
&apikey=${API_TOKEN}`;

    logger({
        event: 'Making API request',
        msg: url,
    });

    axios.get(url)
        .then(apiResponse => {
            logger({
                event: 'Success API request',
            });
            logger({
                event: 'Responding with API data',
            });

            return response
                .json(apiResponse.data);
        })
        .catch(apiError => {
            logger({
                event: 'Error',
                msg: apiError,
            });

            return response
                .status(500)
                .json({
                    status: 500,
                    error: true,
                    message: 'Internal API server error.',
                });
        });
});

app.listen(PORT, () => {
    console.log(`Listening for API requests on http://localhost:${PORT}`);
});
