"""Runtime configuration for the Neulens AI service.

Every secret this module reads stays on the server. Nothing here is ever
serialised into a response or shipped to the browser.
"""

from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    environment: str = "development"
    log_level: str = "info"

    supabase_url: str | None = None
    supabase_service_role_key: str | None = None

    supabase_jwks_url: str | None = None
    supabase_jwt_secret: str | None = None
    supabase_audience: str = "authenticated"

    allowed_origins: str = "http://localhost:5173"

    # Shared secret for server-to-server calls from the Express API, which owns
    # platform sessions and forwards uploaded audio here. Empty disables it.
    internal_api_key: str | None = None

    gnani_api_base_url: str = "https://api.vachana.ai"
    gnani_api_key: str | None = None
    gnani_timeout_ms: int = 15_000

    enable_model_inference: bool = False

    # Local, open-weights explanation model served by Ollama. The default is
    # localhost so assessment data never leaves the deployment by accident.
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "qwen2.5:3b"
    ollama_timeout_seconds: float = 20.0

    @property
    def origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def jwks_url(self) -> str | None:
        if self.supabase_jwks_url:
            return self.supabase_jwks_url
        if self.supabase_url:
            return f"{self.supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json"
        return None


@lru_cache
def get_settings() -> Settings:
    return Settings()
