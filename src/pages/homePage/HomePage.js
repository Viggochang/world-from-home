import React from 'react'
import { Route, BrowserRouter, Switch } from "react-router-dom";

import World from '../world/World'
import MyPage from '../myPage/MyPage';

export default function HomePage() {
  return (
    <BrowserRouter>
      <World/>
      <Switch>
        <Route path='/mypage'>
          <MyPage />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
