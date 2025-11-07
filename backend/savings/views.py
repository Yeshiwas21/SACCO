from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from .models import Saving
from .serializers import SavingSerializer

class SavingRegisterView(generics.CreateAPIView):
    queryset = Saving.objects.all()
    serializer_class = SavingSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser, JSONParser) 

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Auto-handle date or use today's date if not provided
        from django.utils import timezone
        if not data.get("date"):
            data["date"] = timezone.now().date()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        saving = serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SavingListView(generics.ListAPIView):
     permission_classes = [IsAuthenticatedOrReadOnly]
     def get(self, request):
        savings = Saving.objects.all().values("saving_id",
            "member",
            "date",
            "saving_type",
            "reference_number",
            "payment_method",
            "amount",
            "interest",
            "status")
        return Response(list(savings), status=status.HTTP_200_OK)