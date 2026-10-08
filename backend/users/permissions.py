from rest_framework.permissions import BasePermission, SAFE_METHODS


class EstAdmin(BasePermission):
    """Réservé aux administrateurs."""

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.est_admin)


class LectureConnectesEcritureAdmin(BasePermission):
    """Tout utilisateur connecté peut consulter ; seul un administrateur peut modifier."""

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return True
        return user.est_admin
