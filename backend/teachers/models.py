from django.conf import settings
from django.db import models


class Teacher(models.Model):
    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"
        OTHER = "other", "Other"

    class EmploymentType(models.TextChoices):
        FULL_TIME = "full_time", "Full Time"
        PART_TIME = "part_time", "Part Time"
        CONTRACT = "contract", "Contract"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"
        ON_LEAVE = "on_leave", "On Leave"
        TERMINATED = "terminated", "Terminated"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="teacher_profile",
    )

    staff_number = models.CharField(
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

    qualification = models.CharField(
        max_length=150,
        blank=True,
    )

    specialization = models.CharField(
        max_length=150,
        blank=True,
    )

    employment_date = models.DateField()

    employment_type = models.CharField(
        max_length=20,
        choices=EmploymentType.choices,
        default=EmploymentType.FULL_TIME,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    emergency_contact_name = models.CharField(
        max_length=150,
        blank=True,
    )

    emergency_contact_phone = models.CharField(
        max_length=20,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["first_name", "last_name"]

    @property
    def full_name(self):
        names = [
            self.first_name,
            self.other_names,
            self.last_name,
        ]

        return " ".join(
            name for name in names if name
        )

    def save(self, *args, **kwargs):
        is_new_teacher = self.pk is None

        super().save(*args, **kwargs)

        if is_new_teacher and not self.staff_number:
            self.staff_number = (
                f"PRM-TCH-{self.employment_date.year}-"
                f"{self.pk:03d}"
            )

            super().save(
                update_fields=["staff_number"],
            )

    def __str__(self):
        return (
            f"{self.staff_number} - "
            f"{self.full_name}"
        )