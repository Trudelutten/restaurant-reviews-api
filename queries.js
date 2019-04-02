const Pool = require('pg').Pool;
const pool = new Pool({
    connectionString: 'postgres://wgnbigwgidiwaq:e290029bae3dcf169267b6befc285e7123fde55b8f3094ce0e8614b59565ebf2@ec2-54-228-252-67.eu-west-1.compute.amazonaws.com:5432/ddpnoe1gdmnldg',
    ssl: true
});



