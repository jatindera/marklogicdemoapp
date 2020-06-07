var userProfile;
const redirectToLogin = (req, res, next) => {
    if (!req.isAuthenticated() || userProfile == null) {
        return res.redirect('https://myapps.microsoft.com/signin/appserver-water/27757783-5217-479e-b2f6-5e7b2b98d652?tenantId=c643d250-0dd7-416f-889e-a93f0e4ef800');
    }
    next();
};
