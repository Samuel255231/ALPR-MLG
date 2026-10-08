// Noms affichés pour chaque rôle
const LIBELLES: Record<string, string> = {
    admin: "Administrateur",
    operateur: "Opérateur",
}

export function libelleRole(role?: string) {
    return (role && LIBELLES[role]) || role || ""
}
