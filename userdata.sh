#!bin/bash

# install git
sudo yum update -y
sudo yum install git -y

# install nvm, node, and yarn
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install --lts
nvm use --lts
node -e "console.log('Running Node.js ' + process.version)"
npm install --global yarn

# clone repo and start yarn
git clone https://github.com/wesleychipeco/trifecta-fantasy-league.git
cd trifecta-fantasy-league/
yarn
yarn start
