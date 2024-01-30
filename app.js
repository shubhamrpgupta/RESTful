const express = require("express");

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const availableTiming = [
    {
        day: "Monday",
        availablity:
            [
                {
                    "start": "08:30",
                    "end": "11:45"
                }, {
                    "start": "14:15",
                    "end": "16:45"
                },
                {
                    "start": "20:00",
                    "end": "23:00"
                }
            ]
    },
    {
        day: "Tuesday",
        availablity:
            [
                {
                    "start": "09:00",
                    "end": "12:30"
                },
                {
                    "start": "14:00",
                    "end": "17:00"
                }
            ]
    },
    {
        day: "Wednesday",
        availablity:
            [
                {
                    "start": "10:15",
                    "end": "12:45"
                },
                {
                    "start": "13:30",
                    "end": "16:00"
                }
            ]
    },
    {
        day: "Thursday",
        availablity: [
            {
                "start": "09:30",
                "end": "12:00"
            },
            {
                "start": "15:00",
                "end": "17:30"
            },
            {
                "start": "20:30",
                "end": "23:00"
            }
        ]
    },
    {
        day: "Friday",
        availablity: [
            { "start": "08:00", "end": "18:00" }
        ]
    },
    {
        day: "Saturday",
        availablity: [
            { "start": "10:30", "end": "13:00" }
        ]
    }
    , {
        day: "Sunday",
        availablity: []
    }
]

const convertHoursIntoMinute = (timeInStr) => {
    const hour = timeInStr.split(":")[0] * 60;
    const minute = parseInt(timeInStr.split(":")[1]);
    const wholeDayIntoMin = hour + minute;
    return wholeDayIntoMin;
}

app.get("/doctor-availability", (req, res) => {

    const { date, time } = req.query;



    const givenDay = new Date(date).toLocaleDateString(undefined, { weekday: "long" });
    const givenTime = convertHoursIntoMinute(time);




    availableTiming.map((data) => {
        if (givenDay === data.day) {

            //Checking the available slot in that day.

            const answer = Boolean(data.availablity.find((slot) => {
                return (givenTime >= convertHoursIntoMinute(slot.start) && givenTime <= convertHoursIntoMinute(slot.end))
            }))
            if (answer === true) {
                res.json({ isAvailable: answer })
            } else {

                //Checking the availability of next slot on either that day or next available day.

                if (data.availablity.length !== 0) {
                    const beforeAnySlot = Boolean(givenTime < convertHoursIntoMinute(data.availablity[0].start))

                    const afterEverySlot = Boolean(givenTime > convertHoursIntoMinute(data.availablity[data.availablity.length - 1].end))

                    if (beforeAnySlot === true) {
                        const rescheduled = { date: date, time: data.availablity[0].start }
                        res.json({ isAvailable: false, nextAvailableSlot: rescheduled })

                    } else if (afterEverySlot) {
                        const nextAvailableDay = availableTiming[availableTiming.indexOf(data) + 1];
                        let today = new Date(date);
                        let tomorrow = new Date(today);
                        tomorrow.setDate(today.getDate() + 1);
                        const nextDate = tomorrow.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                        })

                        const rescheduled = { date: nextDate, time: nextAvailableDay.availablity[0].start }
                        res.json({ isAvailable: false, nextAvailableSlot: rescheduled })

                    } else {
                        const foundSlot = data.availablity.find((slot) => {
                            return convertHoursIntoMinute(slot.start) > givenTime
                        })
                        const rescheduled = { date: date, time: foundSlot.start }
                        res.json({ isAvailable: false, nextAvailableSlot: rescheduled })
                    }
                } else {

                    //if there is no availability

                    const nextAvailableDay = availableTiming[0];
                    let today = new Date(date);
                    let tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    const nextDate = tomorrow.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    })
                    const rescheduled = { date: nextDate, time: nextAvailableDay.availablity[0].start }
                    res.json({ isAvailable: false, nextAvailableSlot: rescheduled })
                }
            }
        } else null
    })

})


app.listen(3000, () => {
    console.log("Listeing on Port 3000!!")
})
