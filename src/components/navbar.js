import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink} from 'reactstrap';


class MyNavbar extends Component{
  constructor(props){
    super(props);
    this.state = {
      isOpen: false,
      scrolling: false,
    }
  }

  toggleNavbar=()=>{
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  closeNavbar=()=>{
    if(this.state.isOpen){
      this.setState({
        isOpen: false,
      })
    }
  }

  componentDidMount(){
    this.addListenerToNavBar();
    this.props.setClick(this.closeNavbar);
  }

  addListenerToNavBar(){
    let htmlDiv = document.getElementsByTagName('html')[0];
    let navBar = document.getElementsByClassName('navbar')[0];
    let collapseDiv = navBar.querySelector('.show, .collapse');
    let resizeNavBarTimer;
    // adjust navbar's properties if scrolled pass certain pixels
    window.onscroll = (e)=>{
      clearTimeout(resizeNavBarTimer);
      resizeNavBarTimer = setTimeout(()=>{
        this.reduceNavBarSize(e,htmlDiv,navBar,collapseDiv);
      },150);
    };
    // close navbar collapse if remained open on bigger viewport
    var toggleNavbarTimer;
    window.addEventListener('resize',()=>{
      clearTimeout(toggleNavbarTimer);
      toggleNavbarTimer = setTimeout(()=>{
        if(window.innerWidth > 992 && this.state.isOpen) {
          let div = (navBar.getElementsByClassName('show'))[0];
          this.toggleNavbar();
          div.className = "collapse navbar-collapse";
        }
      },100);
    })
    // Close navbar on nav item click
    let nav_items = document.querySelectorAll('.nav-item');
    for(let i =0; i< nav_items.length; i++){
      nav_items[i].querySelector('a').addEventListener('click', this.closeNavbar);
    }
  }

  reduceNavBarSize(e,htmlDiv,navBar,collapseDiv){
    let distance = htmlDiv.getBoundingClientRect().top;
    if(distance <= -30) {
      navBar.setAttribute('style',
        'height: 60px; line-height: 3.75em; font-size: .75em; padding: .375em 2.25em;');
      collapseDiv.setAttribute('style', 'line-height: inherit; margin-top: 0px;');
    } else if (distance > -30){
      navBar.setAttribute('style','height: 106px; line-height: 5em; padding: 0.5em 3em;');
      collapseDiv.setAttribute('style','line-height: 1em');
    }
    window.oldScrollY = window.scrollY;
  }

  render(){
    return(
        <div>
          <Navbar light expand="lg" className="fixed-top">
            <Link to='/clone_bread_project' onClick={this.closeNavbar} className="navbar-brand mr-auto">
              ORIGINAL LOGO HERE
            </Link>
            <NavbarToggler className="text-primary" onClick={this.toggleNavbar}>
              <span className="navbar-toggler-icon"></span>
            </NavbarToggler>
            <Collapse isOpen={this.state.isOpen} expand="lg" navbar>
                <Nav className="ml-auto text-muted" expand="lg" navbar>
                  <NavItem className="navbar-text">
                    <Link to="/clone_bread_project/home">What We Do</Link>
                  </NavItem>
                  <NavItem className="navbar-text">
                    <Link to="/clone_bread_project/about" >Who We Are</Link>
                  </NavItem>
                  <NavItem className="navbar-text">
                    <Link to="/clone_bread_project/help" >Get Involved</Link>
                  </NavItem>
                  <NavItem className="navbar-text">
                    <Link to="/clone_bread_project/news" >News & Events</Link>
                  </NavItem>
                  <NavItem className="navbar-text">
                    <Link to="/clone_bread_project/application" >Apply to Program</Link>
                  </NavItem>
                  <NavItem className="navbar-text">
                    <Link to="/clone_bread_project/donation" >Donate!</Link>
                  </NavItem>
                </Nav>
            </Collapse>
          </Navbar>
        </div>
    )
  }
}

export default withRouter(MyNavbar);
