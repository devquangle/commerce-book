"""
utils/logger_utils.py

Production-ready DEBUG logging helpers for eKYC.
Follows DRY and SOLID principles.
"""

import logging
from typing import Optional, Any

logger = logging.getLogger("ekyc_debug")


def _debug_step(step_name: str) -> None:
    """Logs a major step in the pipeline."""
    if logger.isEnabledFor(logging.DEBUG):
        logger.debug("=" * 80)
        logger.debug(f"[STEP] {step_name}")
        logger.debug("=" * 80)


def _debug_field(
    field_name: str,
    regex_pattern: str,
    source_line: Optional[str] = None,
    matched_text: Optional[str] = None,
    raw_value: Optional[str] = None,
    cleaned_value: Optional[str] = None,
    normalized_value: Optional[str] = None,
    is_valid: Optional[bool] = None,
    returned_value: Any = None,
    reason: Optional[str] = None,
) -> None:
    """Logs the full trace of extracting a single field."""
    if not logger.isEnabledFor(logging.DEBUG):
        return

    logger.debug("=" * 80)
    logger.debug(f"FIELD : {field_name}")
    logger.debug("=" * 80)
    
    if regex_pattern:
        logger.debug("Regex:")
        logger.debug(regex_pattern)
        logger.debug("")

    if source_line is not None:
        logger.debug("Source line:")
        logger.debug(source_line)
        logger.debug("")

    if matched_text is not None:
        logger.debug("Matched:")
        logger.debug(matched_text)
        logger.debug("")

    if raw_value is not None:
        logger.debug("Raw:")
        logger.debug(raw_value)
        logger.debug("")

    if cleaned_value is not None:
        logger.debug("Cleaned:")
        logger.debug(cleaned_value)
        logger.debug("")

    if normalized_value is not None:
        logger.debug("Normalized:")
        logger.debug(normalized_value)
        logger.debug("")

    if is_valid is not None:
        logger.debug("Valid:")
        logger.debug(str(is_valid))
        logger.debug("")

    logger.debug("Returned:")
    logger.debug(str(returned_value))

    if reason is not None:
        logger.debug("Reason:")
        logger.debug(f"- {reason}")
    
    logger.debug("=" * 80)
    logger.debug("")


def _debug_before_after(func_name: str, input_val: Any, output_val: Any) -> None:
    """Logs before and after states of a cleaning/normalization function."""
    if not logger.isEnabledFor(logging.DEBUG):
        return
        
    logger.debug(f"{func_name}")
    logger.debug("Input:")
    logger.debug(str(input_val))
    logger.debug("Output:")
    logger.debug(str(output_val))
    logger.debug("")
