import jwt from "jsonwebtoken"

const isAuthanticated = async (req, res, next) => {
   
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "user not authanticated"
            })
        }


        const decode = jwt.verify(token, process.env.SECRET_KEY)


        req.userId = decode.userId;
        req.role = decode.role
        next()



    } catch (error) {
        console.log(error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "session expired, please login again"
            })
        }
        return res.status(401).json({
            success: false,
            message: "authantcation error"
        })

    }
}


export default isAuthanticated