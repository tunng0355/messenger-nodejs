import express from 'express';
import Pages from '../app/controller/pages';
import Authentication from '../app/controller/auth';
import Friend from '../app/controller/friend';
import Chat from '../app/controller/chat';


import Auth from '../app/middleware/auth';
import Guest from '../app/middleware/guest';

import AuthAPI from '../app/middleware/authAPI';
import GuestAPI from '../app/middleware/guestAPI';

const Router = express.Router();

// users
Router.get('/', Guest,Pages.TrangChu);
Router.get('/t/{uid}/message/{ChatID}/views',Guest, Pages.Chat);


Router.get('/login',Auth, Pages.DangNhap);
Router.get('/register',Auth, Pages.DangKy);

Router.post('/api/register',AuthAPI, Authentication.DangKy);
Router.post('/api/login',AuthAPI, Authentication.DangNhap);

Router.post('/api/chat/get',GuestAPI, Chat.get);

Router.post('/api/friend/add',GuestAPI, Friend.add);
Router.post('/api/friend/status',GuestAPI, Friend.status);
Router.get('/api/friend/friend',GuestAPI, Friend.getFriend);
Router.get('/api/friend/invitation',GuestAPI, Friend.getInvitation);

Router.post('/api/chat/send',GuestAPI, Chat.send);



module.exports= Router;

