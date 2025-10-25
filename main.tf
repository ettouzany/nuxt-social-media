terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "4.0.0"
    }
  }
}

resource "vercel_project" "nuxt_social_media" {
  name      = "nuxt-social-media"
  framework = "nuxtjs"
  
  git_repository = {
    type = "github"
    repo = "ettouzany/nuxt-social-media"
  }
}

# Note: Vercel Blob stores need to be created manually via:
# 1. Vercel Dashboard: Go to Storage > Create Database > Blob
# 2. Vercel CLI: vercel blob create posts-store
# The Terraform provider doesn't support Blob stores yet
# Environment variable: BLOB2_READ_WRITE_TOKEN will be automatically created

