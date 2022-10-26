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
Then immediately manually add `playoffPoints` and `totalTrifectaPoints` to sports's `trifectaStandings` for each owner, putting ? for playoff points and same total while playoffs are happening until playoffs finish
Code looks for "seasonStarted" = `true` and "inSeason" = `false` to decide to look for `playoffPoints` and `totalTrifectaPoints`
~~Also for each owner, go to the that owner's current year's matchups and scrape the just completed season~~

## START NEW TRIFECTA SEASON

When Basketball starts, while previous Trifecta season is still happening, simply add a new "2023 Basketball Standings" button to the navbar and update `seasonVariables` "basketballAhead" to true
Update `teamNumbersPerSport` collection for new Trifecta Season (per Trifecta season, maps "teamNumber" to "ownerNames") - used in Matchups  
Update `teamLists` collection for new Trifecta Season (per Trifecta Season, array of participating "ownerIds") - used in Trifecta Standings
When previous Football season ends, new Trifecta season transition will officially occur. Update `seasonVariables` collection with new "currentYear", each sport's variables (set "basketball": "seasonStarted" and "inSeason" to true, set everything else to false)
After trifecta season has ended, need to update Hall of Fame and each owner's all-time records (profiles). Then to update "ALL" matchups to include the just completed Trifecta season, ~~go to the commissioner page and scrape~~ have to do manually as of now

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

- NameCheap Domain -> ELB with SSL termination -> EC2 instance running yarn server (in AutoScaling Group launched using Launch Template)
- To make changes to production website, after merging PR to master, terminate running EC2 instance. This will trigger the ASG to start new EC2 instance with most-up-to-date master branch

## Each year reboot

- Each trifecta season, create new gmail account `trifectacommissioner<year>@gmail.com`
- Sign up for free AWS tier
- In November, renew trifectafantasyleague domain
- Create SSL termination in Amazon Certificate Manager (ACM)
  - Request a certificate for: \*.trifectafantasyleague.com
  - Use DNS validation to validate ownership of domain
    - Use given ACM CNAME name (just the pre-domain (ie. pre-dot) part) and ACM CNAME value and copy into NameCheap advanced DNS records
- Create Security Groups (To make traffic rules dependent on the other SG, you'll have to go back and add the rule after both SGs are created)
  - ALB Security Group:
    - Inbound Traffic Rules: Allow TCP protocol connections:
      - HTTP on port 80 (source: 0.0.0.0/0)
      - HTTPS on port 443 (source: 0.0.0.0/0)
    - Outbound Traffic Rules: Allow ALL traffic connections on all ports to EC2 SG
  - EC2 Security Group:
    - Inbound Traffic Rules: Allow TCP protocol connections:
      - TCP on port 3000
      - SSH on port 22
    - Outbound Traffic Rules: Allow ALL traffic connections on all ports to 0.0.0.0/0 destination
- Create Launch Template
  - Check box "Provide guidance to set up a template that can use EC2 Auto Scaling"
  - Use Amazon Linux AMI (image)
  - Choose free-tier eligible instance type (t2.micro)
  - Create new key-pair for logging in
  - Select created EC2 security group
  - Add Storage: EBS Volume (up to 30GB free. Don't need more than 4 honestly though)
- Create Auto Scaling Group
  - Select created Launch Template and set desired, min, and max # of instances at 1
  - Connect Application Load Balancer to Auto Scaling Group (will have to be done after ALB is created)
- Due to Auto Scaling Group, EC2 instance launch with Launch Template should start up (if doesn't start, do so manually)
- Check that user data script is run and webserver is active
  - After connecting to EC2 instance, "ls /" and see that "trifecta-fantasy-league" repo is copied to the root directory
  - After connecting to EC2 instance, curl localhost:3000
  - Also: To check if user-data.sh script has run, right-click on instance, then select "Monitor and troubleshoot", then "Get system log"
- Create Application Load Balancer
  - Attributes:
    - Internet-facing
    - ipv4
    - Make available in all AZs
    - Use ALB security Group
  - Attach ACM SSL termination certificate to ALB
  - Use ALB Security Group
  - 2 Listeners: 1) HTTP on Port 80 and 2) HTTPS on Port 443
    - Assign ACM certificate for SSL termination on HTTPS on port 443
  - Create Target Group for FORWARD traffic (After EC2 instance is launched)
    - Webserver Target Group receiving only HTTP traffic on port 3000
    - Register Target EC2 instance to the Target Group (After create EC2 instance)
- Check that website is reachable via load balancer public IP DNS name
  - Put DNS name of ALB into browser URL bar to test
- Register public DNS name of ELB to trifectafantasyleague.com DNS resolution (on NameCheap)
- Finally, test http and https connections to wwww.trifectafantasyleague.com
- Create a budget threshold of $0.01 monthly forecasted budget and email to notify when forecasted to surpass
