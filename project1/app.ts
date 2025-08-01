import express, {Request, Response, NextFunction } from 'express';

const app = express();
const port = 3001;

interface LocationWithTimezone {
    location: string;
    timezoneName: string;
    timezoneAbbr: string;
    utcOffset: number;
}

const getLocationsWithTimezones = (request: Request, response: Response, next: NextFunction) => {
    let locations: LocationWithTimezone[] =[
        {
            location: 'Germany',
            timezoneName: 'Central European Time',
            timezoneAbbr: 'CET',
            utcOffset: 1
        },
        {
            location: 'China',
            timezoneName: 'China Standard Time',
            timezoneAbbr: 'CST',
            utcOffset: 8
        },
        {
            location: 'Argentina',
            timezoneName: 'Argentina Time',
            timezoneAbbr: 'ART',
            utcOffset: -3
        },
        {
            location: 'Japan',
            timezoneName: 'Japan Standard Time',
            timezoneAbbr: 'JST',
            utcOffset: 9
        }
    ];

    response.status(200).json(locations);
}


/**
 * onst getLocationsWithTimezones = (request: Request, response: Response, next: NextFunction) => {
 *   let locations: LocationWithTimezone[] = [
 *     {
 */

app.listen(port, () => {
    console.log(`Timezones by location application is running on port ${port}`)
});

app.get('/timezones', getLocationsWithTimezones)