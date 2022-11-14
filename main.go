package main

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
)

const defaultWorkDurationInMins = 1
const defaultRestDurationInMins = 1

func main() {
	a := app.New()
	win := a.NewWindow("Gomodoro")
	clock := widget.NewLabel("")

	workDurationInMins := defaultWorkDurationInMins
	restDurationInMins := defaultRestDurationInMins
	if len(os.Args) != 3 {
		fmt.Println("No number of arguments, using default values of 25 minutes working and 5 minutes resting")
	}
	if len(os.Args) == 3 {
		workdur, err1 := strconv.Atoi(os.Args[1])
		restdur, err2 := strconv.Atoi(os.Args[2])
		workDurationInMins = workdur
		restDurationInMins = restdur
		if err1 != nil || err2 != nil {
			fmt.Println("Problem setting interval values, using default values of 25minutes working and 5minutes resting")
		}
	}

	var timerInstance timer
	resumeBtn := widget.NewButton("Start", nil)

	resumeBtn.OnTapped = func() {
		//check if timer is not yet running
		if timerInstance == (timer{}) {
			timerInstance = timer{
				start:        time.Now(),
				running:      true,
				inWorkMode:   true,
				workDuration: workDurationInMins * 60,
				restDuration: restDurationInMins * 60,
			}

			go timerInstance.updateTime(clock)

			// change btn name
			resumeBtn.Text = "Pause"

			//timer is already running
		} else {
			if timerInstance.running {
				resumeBtn.Text = "Pause"
				timerInstance.pause()
			} else {
				resumeBtn.Text = "Resume"
				timerInstance.resume()
			}
		}
	}

	win.SetContent(container.NewVBox(clock, resumeBtn))
	win.ShowAndRun()
}
