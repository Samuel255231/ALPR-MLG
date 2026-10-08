from django.db import models

class Stock(models.Model):
    date = models.DateField(auto_now_add=True)
    quantite_actuelle = models.IntegerField(default=0)

    def __str__(self):
        return f"Stock {self.quantite_actuelle} Big Bags (date: {self.date})"
