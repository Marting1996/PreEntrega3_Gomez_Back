export const isAdmin = (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
           // console.log("Usuario no autenticado");
            return res.status(403).send('Acceso no autorizado.');
        }
        if (req.user && req.user.user && req.user.user.role === 'admin') {
            //console.log("Middleware isAdmin ejecutado");
            //console.log("Rol del usuario:", req.user.user.role);
            return next();
        }
        console.log("Usuario no tiene el rol de administrador");
        return res.status(403).send('Solo el admin puede realizar esta acción.');
    } catch (error) {
        console.error("Error en middleware isAdmin:", error);
        return res.status(500).send("Error interno del servidor");
    }
};
