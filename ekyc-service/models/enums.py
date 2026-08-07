"""
Enums used in the eKYC Service.
"""
from enum import Enum

class Gender(str, Enum):
    MALE = "Nam"
    FEMALE = "Nữ"

class AttackType(str, Enum):
    NONE = "none"
    SCREEN = "screen"
    PRINT = "print"
    MASK = "mask"
    UNKNOWN = "unknown"
