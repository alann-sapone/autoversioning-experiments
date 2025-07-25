# auto-versioning-experiments
Branches ideas :
- main branch > current latest devs > not releasable as-is as not tester yet

If a QA starts
- Creates release branch : Forks main into release branch such as release/17
    - While being tested, fixes targets release/17
  
If a QA ends
- Keeps release/17 branch as-is even when done
  - Once merged, automatically generate a new PR with same changes (even conflicted) targeting main -> https://github.com/marketplace/actions/auto-cherry-pick
  - Merge fixes on main

