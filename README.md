# pr-lint

Statistics and checks for pull requests.

Loads pull requests for a github and calculates

Per repo/team


Per day/week/month:

- TTM - time to merge
- TTR - time to review
- \# PRs created total
  - \# PRs merged
  - \# PRs closed

Per Reviewer:

- \# Reviews
  - commented
  - changes requested
  - approved 
  - total
- TTR
- Not caught (approved with another reviewer requesting changes afterwards)
- #Comments

Per reviewee:
- \# Created
- \# Closed
- \# Merged
- 
- TTM
- Approval rate
- \# Lines changed per PR
  - Deleted
  - Added
  - Total
- \# Commits
- #Comments


To implement:
Scraper:
- Check repo
- Pull all PR's
- Make calculations
- Write to redis
- on re-run, grab missed PR's only

API:
- Return data in time ranges

Display:
- Show graphs etc


TODO: 
- also grab comments for reviews so they can be counted per reviewer