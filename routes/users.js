const { Router } = require('express')
const userModel = require('../models/User')


const router = Router();

/*==============GET ROUTES===================*/

//Get all users from the database
router.get('/', async (req, res) => {
    try {
        const users = await userModel.find({})
        res.status(200).json(users);
    } catch (err) {
        res.status(200).json({ error: err });
    }

})


//Get the user log
router.get('/:_id/logs', async (req, res) => {

    const id = req.params._id;
    try {
        const userLog = await userModel.findById(id).exec();

        if (req.query.from || req.query.to) {

            //prepare timestamps for comparing dates
            let fromDate = new Date(0).getTime();
            let toDate = new Date().getTime();

            if (req.query.from) {
                fromDate = new Date(req.query.from).getTime()
            }

            if (req.query.to) {
                toDate = new Date(req.query.to).getTime()
            }

            userLog.log = userLog.log.filter(exercise => {
                exerciseTimestamp = exercise.date.getTime()
                if (exerciseTimestamp >= fromDate && exerciseTimestamp<= toDate) return true;
            })

        }

        if (req.query.limit) {
            userLog.log = userLog.log.slice(0, req.query.limit)
        }

        const resultJson = {
            username: userLog.username,
            count: userLog.log.length,
            _id: userLog._id,
            log: userLog.log.map(({description, duration, date}) => {
                return {
                  description,
                  duration,
                  date: date.toDateString()
                }
              })
        };

        res.status(200).json(resultJson);

    } catch (err) {
        res.status(200).json({ error: err });
    }

})


/*==============POST ROUTES===================*/


//Register a user
router.post('/', (req, res) => {

    try {
        const newUser = new userModel({ username: req.body.username, log: [] })
        // save the object in the database
        newUser.save((errSaved, userSaved) => {
            if (errSaved) {
                res.status(200).json({ err: errSaved });
            }
            const { _id, username } = userSaved;
            res.status(200).json({
                username,
                _id
            });
        })
    } catch (err) {
        res.status(200).json({ error: err });
    }

})

//Add an exersize to a user
router.post('/:_id/exercises', (req, res) => {

    const id = req.params._id;
    const { description, duration, date } = req.body;


    const userIdInput = id;
    const descriptionInput = description;
    const durationInput = duration;
    const dateInput = date || new Date().toISOString();


    try {
        userModel.findOneAndUpdate(
            {
                _id: userIdInput
            },
            {
                $push: {
                    log: {
                        description: descriptionInput,
                        duration: durationInput,
                        date: dateInput
                    }
                }
            },
            {
                new: true
            })
            .then(updatedUser => {

                res.json({
                    username: updatedUser.username,
                    description: updatedUser.log[updatedUser.log.length - 1].description,
                    duration: updatedUser.log[updatedUser.log.length - 1].duration,
                    date: updatedUser.log[updatedUser.log.length - 1].date.toDateString(),
                    _id: updatedUser._id
                });

            }).catch(err => {
                res.status(200).json({ error: err });
            });
    } catch (err) {
        res.status(200).json({ error: err });
    }
})


module.exports = router;