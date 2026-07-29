from django.conf import settings
from django.db import models


class Student(models.Model):
    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"
        GRADUATED = "graduated", "Graduated"
        SUSPENDED = "suspended", "Suspended"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="student_profile",
    )

    admission_number = models.CharField(
        max_length=30,
        unique=True,
        null=True,
        blank=True,
        editable=False,
    )

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    other_names = models.CharField(
        max_length=100,
        blank=True,
    )

    date_of_birth = models.DateField()

    gender = models.CharField(
        max_length=10,
        choices=Gender.choices,
    )

    email = models.EmailField(blank=True)

    phone_number = models.CharField(
        max_length=20,
        blank=True,
    )

    address = models.TextField(blank=True)

    guardian_name = models.CharField(
        max_length=150,
    )

    guardian_phone = models.CharField(
        max_length=20,
    )

    guardian_email = models.EmailField(blank=True)

    admission_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["first_name", "last_name"]

    def save(self, *args, **kwargs):
        is_new_student = self.pk is None

        super().save(*args, **kwargs)

        if is_new_student and not self.admission_number:
            self.admission_number = (
                f"PRM-{self.admission_date.year}-"
                f"{self.pk:03d}"
            )

            super().save(
                update_fields=["admission_number"],
            )

    def __str__(self):
        return (
            f"{self.admission_number} - "
            f"{self.first_name} {self.last_name}"
        )