from django.utils import timezone
from rest_framework import serializers

from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Student

        fields = [
            "id",
            "user",
            "admission_number",
            "first_name",
            "last_name",
            "other_names",
            "full_name",
            "date_of_birth",
            "gender",
            "email",
            "phone_number",
            "address",
            "guardian_name",
            "guardian_phone",
            "guardian_email",
            "admission_date",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "admission_number",
            "full_name",
            "created_at",
            "updated_at",
        ]

    def get_full_name(self, obj):
        names = [
            obj.first_name,
            obj.other_names,
            obj.last_name,
        ]

        return " ".join(
            name for name in names if name
        )

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

    def validate_guardian_name(self, value):
        value = value.strip()

        if len(value) < 2:
            raise serializers.ValidationError(
                "Guardian name must contain at least 2 characters."
            )

        return value

    def validate_phone_number(self, value):
        value = value.strip()

        if value and not self._is_valid_phone_number(value):
            raise serializers.ValidationError(
                "Enter a valid phone number."
            )

        return value

    def validate_guardian_phone(self, value):
        value = value.strip()

        if not self._is_valid_phone_number(value):
            raise serializers.ValidationError(
                "Enter a valid guardian phone number."
            )

        return value

    def validate(self, attrs):
        today = timezone.localdate()

        date_of_birth = attrs.get(
            "date_of_birth",
            getattr(self.instance, "date_of_birth", None),
        )

        admission_date = attrs.get(
            "admission_date",
            getattr(self.instance, "admission_date", None),
        )

        if date_of_birth and date_of_birth > today:
            raise serializers.ValidationError(
                {
                    "date_of_birth": (
                        "Date of birth cannot be in the future."
                    )
                }
            )

        if admission_date and admission_date > today:
            raise serializers.ValidationError(
                {
                    "admission_date": (
                        "Admission date cannot be in the future."
                    )
                }
            )

        if (
            date_of_birth
            and admission_date
            and admission_date <= date_of_birth
        ):
            raise serializers.ValidationError(
                {
                    "admission_date": (
                        "Admission date must be after the "
                        "student's date of birth."
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