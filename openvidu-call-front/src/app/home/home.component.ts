import { Component, OnInit, HostListener, Host } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import Speech from 'speak-tts';
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	public roomForm: FormControl;
	public version = require('../../../package.json').version;
	html = '';
	result = '';
	speech: any;
	speechData: any;

	constructor(private router: Router, public formBuilder: FormBuilder) {
		this.speech = new Speech() // will throw an exception if not browser supported
    if(this.speech .hasBrowserSupport()) { // returns a boolean
        console.log("speech synthesis supported")
        this.speech.init({
                'volume': 1,
                'lang': 'ko-KR',
                'rate': 1,
                'pitch': 1,
                'voice':'Google South Korea Korean Female',
                'splitSentences': true,
                'listeners': {
                    'onvoiceschanged': (voices) => {
                        console.log("Event voiceschanged", voices)
                    }
                }
        }).then((data) => {
            // The "data" object contains the list of available voices and the voice synthesis params
            console.log("Speech is ready, voices are available", data)
            this.speechData = data;
            data.voices.forEach(voice => {
            console.log(voice.name + " "+ voice.lang)
            });
        }).catch(e => {
            console.error("An error occured while initializing : ", e)
        })
    }

	// this.router.events.subscribe((e) => {
	// 	if (e instanceof NavigationEnd) {
	// 		this.start()
	// 		console.log("hello");
	// 		// Function you want to call here
	// 	}
	//  });
	}


	start(){
		this.html = '';
	
	
		var temporalDivElement = document.createElement("div");
		// Set the HTML content with the providen
		temporalDivElement.innerHTML = this.html;
		// Retrieve the text property of the element (cross-browser support)
		this.result = temporalDivElement.textContent || temporalDivElement.innerText || "";
		
		  this.speech.speak({
			//   text: this.result,
			text: "안녕하세요. 피어코 시스템 입니다. 사용법을 알려 드리겠습니다. 매 화면 마다 F를 누르면 안내 음성을 들을 수 있습니다. 첫번째 화면에서는 탭키를 눌러서 방 이름을 변경 할 수 있습니다. 그 다음 엔터를 눌러서 접속을 합니다.",
		  }).then(() => {
			  console.log("Success !")
		  }).catch(e => {
			  console.error("An error occurred :", e) 
		  })
	  }


	//   키보드 이벤트
	@HostListener('document:keydown.F ', ['$event'])
	
	onKeydownHandler(event: KeyboardEvent) {
		console.log(event);
		this.start()
	}


	// 초기화
	ngOnInit() {
		// this.start();
		const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: '-', });
		this.roomForm = new FormControl(randomName, [Validators.minLength(4), Validators.required]);
	}

		public goToVideoCall() {
		if (this.roomForm.valid) {
			const roomName = this.roomForm.value.replace(/ /g, '-'); // replace white spaces by -
			this.roomForm.setValue(roomName);
			this.router.navigate(['/', roomName]);
		}
	}

	// blindAlert
	public blindAlert = {
		visible : true,
		message : '시각장애인 안내 서비스를 시작 합니다. 음성 안내가 필요 없으면 마우스로 진행해 주세요.',
		tempTime : null,
		close : () => {
		  console.log('blindAlert.close() --> ');
		  this.blindAlert.visible = false;
		},
		show : ( msg: string ) => {
		  clearTimeout( this.blindAlert.tempTime );
		  this.blindAlert.message = msg;
		  this.blindAlert.visible = true;
		  this.blindAlert.tempTime = this.blindAlert.clear();
		},
		clear : () => setTimeout(() => {
		  this.blindAlert.message = '';
		  this.blindAlert.visible = false;
		}, 1000 * 5)
	  };

	



	  pause(){
		this.speech.pause();
	  }
	  resume(){
		this.speech.resume();
	  }
	
	  setLanguage(i){
		console.log(i);
		console.log(this.speechData.voices[i].lang + this.speechData.voices[i].name);
		this.speech.setLanguage(this.speechData.voices[i].lang);
		this.speech.setVoice(this.speechData.voices[i].name);
	  }
	
	




}
