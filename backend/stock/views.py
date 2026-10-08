from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Stock
from .serializers import StockSerializer

@api_view(["GET"])
def list_stocks(request):
    stocks = Stock.objects.all().order_by("-id")
    serializer = StockSerializer(stocks, many=True)
    return Response(serializer.data)
