terraform {
  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }
}

provider "github" {
  owner = "ivankorn"
}

resource "github_repository" "repo" {
  name = "korn.systems"
}

resource "github_repository_pages" "repo_pages" {
  repository = github_repository.repo.name

  source {
    branch = "main"
    path   = "/"
  }
  cname = "korn.systems"
}

resource "github_branch_protection" "main" {
  repository_id                   = github_repository.repo.node_id
  pattern                         = "main"
  enforce_admins                  = true
  require_conversation_resolution = true

  required_pull_request_reviews {
    dismiss_stale_reviews           = true
    required_approving_review_count = 1
  }
}
