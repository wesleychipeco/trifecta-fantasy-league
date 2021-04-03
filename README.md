### Manual Commissioner To-do Actions

## Fantasy League Commissioner Upkeep

- Set draft date and owner selection slot via reverse regular season standings of 2 sports ago
- After draft, organize division into Evens and Odds
- Create schedule based off of Trifecta Schedules Google sheet (Rank teams in each division E1 to E5 and O1 to O5 via last same sport season's standings)
- Manually edit each team's H2H schedule
- During playoffs, change initial consolation bracket matchup to be 7 vs 10 and 8 vs 9 instead of ESPN's ladder setup

## Website Related

- Each season's rule changes, update Trifecta League Manual accordingly
- Enter MongoDB data (see **Data that needs to be updated in MongoDB manually** below)

## START/END NEW SPORT

To start a sport, set its "seasonStarted" and "inSeason" of that sport to `true`  
If "seasonStarted" is `false`, standings will not be displayed at all  
To end a sport, set its "seasonStarted" to `true` and "inSeason" to `false` --- equivalent to "seasonEnded" = `true`  
Then immediately manually add `playoffPoints` and `totalTrifectaPoints` to sports's `trifectaStandings` for each owner  
Code looks for "seasonStarted" = `true` and "inSeason" = `false` to decide to look for `playoffPoints` and `totalTrifectaPoints`
~~Also for each owner, go to the that owner's current year's matchups and scrape the just completed season~~

## START NEW TRIFECTA SEASON

Update `seasonVariables` collection with new "currentYear", each sport's variables (set "basketball": "seasonStarted" and "inSeason" to true, set everything else to false)
Set `basektballAhead` to true, which will allow basketball of next trifecta season plus football of previous season to be updated
Update `teamNumbersPerSport` collection for new Trifecta Season (per Trifecta season, maps "teamNumber" to "ownerNames") - used in Matchups  
Update `teamLists` collection for new Trifecta Season (per Trifecta Season, array of participating "ownerIds") - used in Trifecta Standings
Then to update "ALL" matchups to include the just completed Trifecta season, ~~go to the commissioner page and scrape~~ have to do manually as of now 

## ADD NEW TRIFECTA OWNER

Add new owner to `allTimeTeams` collection in Mongo (matchups dropdown will auto populate with current season) - used in Matchups  
If not already updated, update `teamNumbersPerSport` collection (per Trifecta season, maps "teamNumber" to "ownerNames") - used in Matchups  
If not already updated, update `teamLists` collection (per Trifecta Season, array of participating "ownerIds") - used in Trifecta Standings  
`ownerIds` and `ownerTeamNumbersList` are not used, but rather both just refernce collections for visual check via the UI

## Each time a new collection is created in MongoDB, to be able to interact with it, need to first add rules in Stitch

- Go to MongoDB Realm tab
- Click on correct, registered application
- Go to "Rules" tab on sidebar and add rules for Read/Write to collection

## Data that needs to be updated in MongoDB manually

- After sport's playoffs are complete, playoff points and total trifecta points
- Trade History
- Hall of Fame (at end of Trifecta season)
- Owner Profiles (at end of Trifecta season)
- Owner Matchups (at end of Trifecta season) [Need to make script that will do this automatically]

## Pages that pull live data from API

- Individual standings of sports that are in-season (only regular season standings)
- Trifecta standings of completely finished (regular season and playoffs) sports


### Website Development and AWS Stuff

## AWS Architecture

- NameCheap Domain -> ELB with SSL termination -> EC2 instance running yarn server (in AutoScaling Group)

## Each year reboot

- Each trifecta season, create new gmail account `trifectacommissioner<year>@gmail.com`
- Sign up for free AWS tier
- In November, renew trifectafantasyleague domain
- Create SSL termination in Amazon Certificate Manager (ACM)
  - **Need to complete**
- Create Application Load Balancer
  - Internet-facing
  - ipv4
  - 2 Listeners: 1) HTTP on Port 80 and 2) HTTPS on Port 443
  - Make available in all AZs
  - Attach ACM SSL termination certificate to ELB
  - Create new Security Group
