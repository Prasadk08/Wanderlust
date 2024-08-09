const User = require('../models/user')

module.exports.renderSignUPform = async(req,res)=>{
    res.render("user/signup.ejs")
}

module.exports.succsssSignUP = async(req,res)=>{
    try{
        let {email,username,password}=req.body
        let newuser = new User({email,username})
        await User.register(newuser,password)
        req.login(newuser,(err)=>{
            if(err){
                return next(err)
            }else{
                req.flash("success","Welcome to WanderLust")
                res.redirect("/")
            }
        })
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login.ejs")
}

module.exports.loginAuth=async(req,res)=>{
    req.flash("success","Welcome back to WanderLust")
    let redirectPath = res.locals.redirectUrl || "/listing"
    res.redirect(redirectPath)
}

module.exports.userLogout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }else{
            req.flash("success","You are successfully logout")
            res.redirect("/login")
        }
    })
}