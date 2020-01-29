const expect = require('expect');
const {Users} = require('./users.js');

describe('Users',()=>{

    var users;

    beforeEach(()=>{
        users = new Users();
        users.users =[{
            id: '1',
            name: 'Mike',
            room: 'Fans'
        },{
            id: '2',
            name: 'Like',
            room: 'Friends'
        },{
            id: '3',
            name: 'Roy',
            room: 'Fans'
        }];
    });

    it('should add new user', ()=> {
        var users = new Users();
        var user ={
            id: '211',
            name: 'Pavithra',
            room: 'Ceyentra'
        };
        var resUser = users.addUser(user.id,user.name,user.room);
        expect(users.users).toEqual([user]);
    });

    it('should remove a user', function () {
        var userId = '1';
        var user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove a user', function () {
        var userId = '99';
        var user = users.removeUser(userId);

        expect(user).toBeFalsy();
        expect(users.users.length).toBe(3);
    });

    it('should find user', function () {
        var userId = '2';
        var user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it('should not find user', function () {
        var userId = '99';
        var user = users.getUser(userId);

        expect(user).toBeFalsy();
    });

    it('should return names for Fans', function () {
        var userList = users.getUserList('Fans');

        expect(userList).toEqual(['Mike','Roy']);
    });

    it('should return names for Friends', function () {
        var userList = users.getUserList('Friends');

        expect(userList).toEqual(['Like']);
    });
});