import React, { Component } from 'react';
import './App.css';
import { UrprLogo } from './components/logo';
import { DesktopNavigation } from './components/navigation/desktopNavigation';
import { IndexFragment } from './views/IndexFragment';
import { TeamFragment } from './views/TeamFragment';
import { OpenDataFragment } from './views/OpenDataFragment';


class App extends Component {
  private subDirectory = window.location.pathname.split("/")[1]
  render() {
    switch (this.subDirectory) {
      case "research":
        return <IndexFragment />
      case "opendata":
        return <OpenDataFragment />
      case "team":
        return <TeamFragment />
      default:
        return <IndexFragment />
    }
  }
}

export default App;