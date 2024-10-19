import bcrypt from "bcryptjs";

export function hashPassword(password: string) {
    return new Promise((resolve, reject) => {
        // Utiliser bcrypt pour générer un salt avec 10 rounds (nombre de tours recommandé)
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return reject(err);

            // Utiliser le salt généré pour hasher le mot de passe
            bcrypt.hash(password, salt, (err, hashedPassword) => {
                if (err) return reject(err);
                resolve(hashedPassword);
            });
        });
    });
}
