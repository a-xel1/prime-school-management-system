from django.utils import timezone
from rest_framework import serializers

from .models import Teacher


class TeacherSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Teacher

        fields = [
            "id",
            "user",
            "staff_number",
            "first_name",
            "last_name",
            "other_names",
            "full_name",
            "date_of_birth",
            "gender",
            "email",
            "phone_number",
            "address",
            "qualification",
            "specialization",
            "employment_date",
            "employment_type",
            "status",
            "emergency_contact_name",
            "emergency_contact_phone",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "staff_number",
            "full_name",
            "created_at",
            "updated_at",
        ]

    def validate_first_name(self, value):
        value = value.strip()

        if len(value) < 2:
            raise serializers.ValidationError(
                "First name must contain at least 2 characters."
            )

        return value

    def validate_last_name(self, value):
        value = value.strip()

        if len(value) < 2:
            raise serializers.ValidationError(
                "Last name must contain at least 2 characters."
            )

        return value

    def validate_phone_number(self, value):
        value = value.strip()

        if value and not self._is_valid_phone_number(value):
            raise serializers.ValidationError(
                "Enter a valid phone number."
            )

        return value

    def validate_emergency_contact_phone(self, value):
        value = value.strip()

        if value and not self._is_valid_phone_number(value):
            raise serializers.ValidationError(
                "Enter a valid emergency contact phone number."
            )

        return value

    def validate(self, attrs):
        today = timezone.localdate()

        date_of_birth = attrs.get(
            "date_of_birth",
            getattr(self.instance, "date_of_birth", None),
        )

        employment_date = attrs.get(
            "employment_date",
            getattr(self.instance, "employment_date", None),
        )

        if date_of_birth and date_of_birth > today:
            raise serializers.ValidationError(
                {
                    "date_of_birth": (
                        "Date of birth cannot be in the future."
                    )
                }
            )

        if employment_date and employment_date > today:
            raise serializers.ValidationError(
                {
                    "employment_date": (
                        "Employment date cannot be in the future."
                    )
                }
            )

        if (
            date_of_birth
            and employment_date
            and employment_date <= date_of_birth
        ):
            raise serializers.ValidationError(
                {
                    "employment_date": (
                        "Employment date must be after the "
                        "teacher's date of birth."
                    )
                }
            )

        return attrs

    @staticmethod
    def _is_valid_phone_number(value):
        allowed_characters = set(
            "0123456789+()- "
        )

        if any(
            character not in allowed_characters
            for character in value
        ):
            return False

        digit_count = sum(
            character.isdigit()
            for character in value
        )

        return 7 <= digit_count <= 15