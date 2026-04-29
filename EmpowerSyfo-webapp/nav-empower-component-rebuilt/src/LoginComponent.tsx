import React, {ChangeEvent, Component} from "react";
import Axios from 'axios';
import Panel  from 'nav-frontend-paneler';
import { Input } from 'nav-frontend-skjema';
import { Hovedknapp} from 'nav-frontend-knapper';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import axios from 'axios';


type loginFormProps = {
	applicationUrl: string,
    empowerUrl: string,
    otdsUrl: string,
	userID: string,
    loginFn: Function
}


export type loginFormState = {
    securityToken: string,
    uname: string,
    pass: string,
	feillogin: boolean,
	feilloginOTDS: boolean,
	enablePanel: boolean,
    unameEmptyFeil: string,
    passEmptyFeil: string
}


export class LoginComponent extends Component<loginFormProps, loginFormState> {
    constructor(props: loginFormProps)  {
        super(props);
        this.getSecurityToken = this.getSecurityToken.bind(this);
        this.loginSubmit = this.loginSubmit.bind(this);
		this.loginGeneralOTDS = this.loginGeneralOTDS.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.addTheTitle = this.addTheTitle.bind(this);
        this.state = {
            securityToken: '', 
            uname: '', //this.props.userId,
            pass: '',
			feillogin: false,
			feilloginOTDS: false,
			enablePanel: true,
            unameEmptyFeil: '',
            passEmptyFeil: ''
        }
    }

    componentDidMount(): void {
		console.log("Login Component starts mounting");
		//this.getSecurityToken(this.props);
		document.title = this.addTheTitle();
		this.loginGeneralOTDS(this.props);
		console.log("Login Component finished mounting");
    };

	addTheTitle(): string{
		console.log("addTheTitle() started");
		let theTitle = "SYFO breveditor";
		const queryString = window.location.search; 
		const urlPm = new URLSearchParams(queryString);
		if(urlPm.get('addTitle') == null) {
			console.log("addTheTitle() finished: The title will be 'SYFO breveditor'");
			return theTitle;
		} else {
			const addTitle = urlPm.get('addTitle') + '';
			if(addTitle.length > 0){
				theTitle = theTitle + " " + addTitle;
			}
			console.log("addTheTitle() finished. The title will be '" + theTitle + "'");
			return theTitle;
		}
		
	};
    
    getSecurityToken(props: loginFormProps): void {
		console.log("getSecurityToken() started");
		const options = props as loginFormProps;
		const empowerUrl = new URL(options.empowerUrl);
		empowerUrl.pathname = "empower/resource/GetToken";
        console.log("Send GET request to Empower to receive security token: " + empowerUrl.href);  //console.log("User: " + this.props.uname + ", password: " + this.props.pass);
        Axios.get(empowerUrl.href, {withCredentials: true
                                   //     auth: {
                                  //               username: this.props.uname,
                                   //              password: this.props.pass
                                 //             }
            }).then((response) => {
                   console.log("Response status: " + response.status + ", " + response.statusText);
                   console.log(response.data);
                   const tokenBody = response.data.body;
                   console.log("Security token (CSRF) received");
                   this.setState( {securityToken: tokenBody.csrfToken});
                   })
                .catch(err => {
                	console.log("An error occurred when getting the csrf token!");
                	console.log(err);
                });
		console.log("getSecurityToken() finished");
    }

	onKeyPress(event: React.KeyboardEvent) {
	    if (event.charCode === 13) {
	        this.loginSubmit();
	    }
	}

    loginSubmit() {
        console.log("loginSubmit() started");
        console.log("Username: " + this.state.uname);
        console.log("Password: ****************");
		this.setState({feillogin: false});
		this.setState({feilloginOTDS: false});
        if (!this.state.uname) {
            this.setState({unameEmptyFeil: "Username cannot be empty"})
        } else {
            this.setState({unameEmptyFeil: ''})
        }
        if (!this.state.pass) {
            this.setState({passEmptyFeil: 'Password cannot be empty'})
        } else {
            this.setState({passEmptyFeil: ''})
        }
        this.props.loginFn(this.state.uname, this.state.pass);
		this.setState({feillogin: true});
		console.log("loginSubmit() finished");
    }
    

	async loginGeneralOTDS(props: loginFormProps): Promise<void>{
		console.log("loginGeneralOTDS() started (asynchronous function)");
		const options = props as loginFormProps;
        // var syfoUrl = new URL(options.empowerUrl);
		const syfoUrl = new URL(options.applicationUrl);

		const applicationPath = window.location.pathname.split('/')[1];
		syfoUrl.pathname = applicationPath + "/api/v1/GetProperties";
		let otdsApiUrl = "";
		let otdsApiUserName = "";
		let otdsApiPassword = "";
		let otdsApiUrlUsersFilter = "";
		let otdsResource = "";
		let csUrl = "";
		let userID = "";  //this.props.userID;		
		if(this.props.userID == null){
			this.setState({feilloginOTDS: false});
			this.setState({enablePanel: true}); 
			console.log("There is no uid (userID) coming from the browser address bar. The Login panel enabled.");
			console.log("loginGeneralOTDS() finished (asynchronous function)");
			return;
		} else {
			console.log("Getting session for the user: " + this.props.userID + " The Login panel disabled.");
			userID = this.props.userID;
			this.setState({ enablePanel: false });
		}
		console.log("Send GET request to SYFO backend to receive application properties: " + syfoUrl);

		Axios.get(syfoUrl.href, {withCredentials: false}).then(async (response) => {
			    otdsApiUrl = response.data.otds.apiUrl;
			    otdsApiUserName = response.data.otds.apiUserName;
				otdsApiPassword = response.data.otds.apiPassword;
				otdsApiUrlUsersFilter = response.data.otds.apiUrlUsersFilter;
				otdsResource = response.data.otds.resource;
				csUrl = response.data.csUrl;
				console.log("Application properties received. ");
				const dataOtdsUserPass = JSON.stringify({"userName": otdsApiUserName,"password": otdsApiPassword});
				const headerOptions = {
				  headers: {'Content-Type': 'application/json'}
				};	
				const urlOtds = new URL(otdsApiUrl);
				try{
					console.info("Send POST request to OTDS to receive an OTDS ticket: " + urlOtds.href);
					const getOTDSticket = await axios.post(urlOtds.href, dataOtdsUserPass, headerOptions);				
					const OTDSticket = getOTDSticket.data.ticket;
					console.info("OTDS ticket received. ");
					try{
						const getFromOtdsURL = new URL(otdsApiUrlUsersFilter + userID);
						const headersOptionsGetFromOtds = {headers: {"Content-Type": "application/json", "OTDSTicket": OTDSticket }}; 
						console.log("Send GET request to OTDS to receive user info: " + getFromOtdsURL.href);
						const getFromOtds = await axios.get(getFromOtdsURL.href, headersOptionsGetFromOtds);
						console.log("The user info received from OTDS. The membership in 'oTMemberOf' will be checked now.");
						const userPartitionID = getFromOtds.data.userPartitionID;
						let v = getFromOtds.data.values.filter(
							function(data: { name: any; }){ return data.name == 'oTMemberOf' }
						)						
						let v2check = v[0].values;
						let string2check = otdsResource;
						if( v2check.find((expression: { includes: (arg0: string) => string | string[]; }): string | string[] => expression.includes(string2check) ) ) {
							this.setState({feilloginOTDS: false});
							this.props.loginFn(otdsApiUserName, otdsApiPassword);
							console.log("Verified OK, the user '" + userID + "' can edit the Empower document");
						} else {
							console.log("Verified not OK, the user '" + userID + "' cannot edit the Empower document. Enabling the Login panel");
							this.setState({feilloginOTDS: true});
							this.setState({enablePanel: true});
						}
					} catch(e) {
			            console.error("Cannot login directly from OTDS. Enabling the Login panel", e);
						this.setState({enablePanel: true});
						this.setState({feilloginOTDS: true});
						console.log("loginGeneralOTDS() finished (asynchronous function)");
			            return;
		       		}				
				} 	catch(e) {
		            console.error("Get OTDS ticket: Error occurred while trying to get the OTDS ticket", e);
					console.log("loginGeneralOTDS() finished (asynchronous function)");
		            return;
	       		}
			}).catch(err => {
				console.log("Something wrong with getting the properties location!");
				console.log(err);			
			});
		console.log("loginGeneralOTDS() finished (asynchronous function)");
	}
	

    render() {
		const style = {
			color: 'black',
			display: 'flex',
			justifyContent: 'center',
			margin: '20px',
		};
		return <>
                <div style={style}>
				{this.state.enablePanel ?
                <Panel border className="inputformcomponents" id="panelLogin">
                    <AlertStripeInfo>
						Logg på med NAV brukerident eller email adresse. <br />Eksempel: "A123456" eller "Ola.Nordmann@nav.no". <br />Benytt ditt NAV passord.
					</AlertStripeInfo>
                    <br/>
                    <Input feil={this.state.unameEmptyFeil} label="User id:" bredde="XXL" value={this.state.uname} onChange = {(event:React.ChangeEvent<HTMLInputElement>) => this.setState({uname:event.target.value})} />
                    <Input feil={this.state.passEmptyFeil} label="Password:" bredde="XXL" value={this.state.pass} type="password" onKeyPress={this.onKeyPress} onChange = {(event:React.ChangeEvent<HTMLInputElement>) => this.setState({pass:event.target.value})} />
                    <br/>
                    <Hovedknapp id="login-form-submit" className="nav-empower-button" onClick={this.loginSubmit} >Login</Hovedknapp>
					{
						this.state.feillogin
                        ? 
							<p id="passfeil" style={{display: 'none'}}>
							<AlertStripeFeil className="alertStripeFeilPassord">
								Passordet eller brukeren er feil.
							</AlertStripeFeil>
							</p>
						: 
							null
					}
					{
						this.state.feilloginOTDS
						? 
							<AlertStripeFeil className="alertstripeLogin">
								Du mangler rolle for redigering av dokumenter. Ta kontakt med lokal identansvarlig for å få rollen <b>Exstream Empower Arena Bruker</b>.
							</AlertStripeFeil>
						: 
							null
					}
                </Panel>
				: <p>  <br/><img src="/syfo/spinner2.gif"  alt={'Waiting spinner'}/><span id="passfeil"></span></p>
				}
                </div>
            </>
    };  
        
}

export default LoginComponent;