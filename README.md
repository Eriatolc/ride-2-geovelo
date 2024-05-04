# ride-2-geovelo

## What is it for?

This project aims to gather biking ride from different platforms (such as Coros and Strava) and push them to Geovelo.

At the time you decide, using a CRON, it will collect all the ride **of the current day** from the different platform (only COROS at the moment) and push them to Geovelo.

> It is advised to set the CRON to a late hour of the day, such as 11:30pm.

## Supported plateforms to export from

* Coros

> You are welcome to suggest and add other platform with a PR!

## How to use it

### 1. Copy and populate your .env from the .env.example

```bash
cp .env.example .env
```

You will need the following informations:

* your Coros login
* your Coros password (the hashed version)
* your Geovelo API key
* your Geovelo login
* your Geovelo password

### 2. Build or download the Docker image

#### 2.1 Building from source

* clone the repository
* build the image using the convenient npm script: `npm run docker-build`

#### 2.2 Download the Docker image

You can also download the Docker image directly from this repository's registry.

```bash
docker pull git.eriatolc.fr/eriatolc/ride2geovelo:<tag_of_your_choice>
```

Replace `<tag_of_your_choice>` by the version you choose.

### 3. Create a crontab entry

Add to you crontab the following entry

```bash
30 23 * * * docker run --env-file /path/to/your/env/file/.env git.eriatolc.fr/eriatolc/ride2geovelo:1.0.0 > /path/to/a/folder/you/want/cron.log
```

> This crontab entry example will start the program at 11:30pm, every day of every month of every year.
