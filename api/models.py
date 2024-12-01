from django.db import models
import uuid


class AirlineAlliances(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Airlines(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    alliance = models.ForeignKey(AirlineAlliances, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Airports(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=5)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.code


class Destinations(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    city = models.CharField(max_length=200)
    state = models.CharField(max_length=200, null=True)
    country = models.CharField(max_length=200)
    airports = models.ManyToManyField(Airports)

    def __str__(self):
        return f'{self.city}, {self.country if not self.state else f"{self.state}, {self.country}"}'


class Flights(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    airline = models.ForeignKey(Airlines, on_delete=models.CASCADE, related_name="related_flights")
    from_destination = models.ForeignKey(Destinations, on_delete=models.CASCADE, related_name="related_from_flights")
    to_destination = models.ForeignKey(Destinations, on_delete=models.CASCADE, related_name="related_to_flights")

    def __str__(self):
        return self.id


class Tickets(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    flights = models.ManyToManyField(Flights)

    def __str__(self):
        return self.id


