import React, { Component } from 'react';
import './App.css';
import { UrprLogo } from './components/logo';
import { DesktopNavigation } from './components/navigation/desktopNavigation';
import { IndexFragment } from './views/IndexFragment';
import { TeamFragment } from './views/TeamFragment';
import { OpenDataFragment } from './views/OpenDataFragment';
import { ResearchPageFragment } from './views/ResearchPageFragment';
import { ConsoleFragment } from './views/ConsoleFragment';
import { ConsoleWrappedFragment } from './views/ConsoleLoginFragment';
import { OpenDataEditor } from './components/editors/OpenDataEditor';
import { PageEditor } from './components/editors/PageEditor';
import { UpdateFragment } from './views/UpdateFragment';


class App extends Component {
  private subDirectory = window.location.pathname.split("/")[1]
  private pageDirectory = window.location.pathname.split("/").length > 2 ? window.location.pathname.split("/")[2] : ""
  render() {
    switch (this.subDirectory) {
      case "research":
        if (this.pageDirectory == "") return <IndexFragment />
        else return <ResearchPageFragment />
      case "opendata":
        return <OpenDataFragment />
      case "team":
        return <TeamFragment />
      case "update":
        return <UpdateFragment />
      case "console":
        return <ConsoleWrappedFragment />
      default:
        return <IndexFragment />
    }
  }
}

export default App;