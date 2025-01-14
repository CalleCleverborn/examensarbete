import { Router } from 'express';
import passport from 'passport';


const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/google/callback", 
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
  
    console.log("User from callback:", req.user);
    
    res.redirect("https://vocalflow.netlify.app/app/dashboard");
  }
);




router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send({ error: err });
    }
    
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); 
      res.redirect("/");
    });
  });
});

router.get('/me', (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.status(401).send({ message: "Not logged in" });
  }
});

export default router;
