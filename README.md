# Car Maintenance Tracker

A web app that helps a car owner keep track of their vehicles. A user can sign up, log in, and
manage a personal list of vehicles (add, view, edit, delete) from a dashboard.

**Author:** My Nhu (GitHub: TranMyNhu)

## Technologies Used

- **Backend:** Java 21, Spring Boot 4.1.1 (Spring Web, Spring Data JPA), Maven (wrapper included)
- **Database:** PostgreSQL
- **Frontend:** plain HTML, CSS and JavaScript (no build step)

## Prerequisites

| Software   | Version      | Notes                                          |
|------------|--------------|------------------------------------------------|
| JDK        | 21           | `java -version` should report 21               |
| PostgreSQL | 14 or newer  | Running locally on port `5432`                 |
| VS Code    | Current      | With the **Live Server** extension (`ritwickdey.LiveServer`) |
| Browser    | Current Chrome / Edge / Firefox |                              |

Maven does not need to be installed; the project includes the Maven wrapper (`mvnw`).

## Installation

From the repository root:

```bash
cd car-maintenance
./mvnw clean install -DskipTests
```

On Windows PowerShell/cmd use `mvnw.cmd clean install -DskipTests` instead. This downloads the
dependencies and builds the backend. The frontend has no dependencies to install.

## Configuration

The backend reads its database settings from
`car-maintenance/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/postgres
    username: postgres
    password: <your PostgreSQL password>
```

1. Make sure a PostgreSQL server is running on `localhost:5432`.
2. Edit `username` and `password` in `application.yml` to match your local PostgreSQL login.
   The default database is `postgres`; if you use another one, change it in the `url`.
3. No tables need to be created by hand. Hibernate creates and updates them on startup
   (`ddl-auto: update`).

## Running the Application

You need two terminals: one for the backend, one for the frontend.

**1. Backend** (from the repository root):

```bash
cd car-maintenance
./mvnw spring-boot:run
```

(Windows: `mvnw.cmd spring-boot:run`.) Wait for a line like `Started CarMaintenanceApplication`.
The API is now available at `http://localhost:8080`.

**2. Frontend:**

1. In VS Code, choose **File > Open Folder** and open the `car-maintenance-ui` folder itself (not
   the repository root).
2. Open `login-signup/login-signup.html`, then right-click in the editor and choose
   **Open with Live Server** (or click **Go Live** in the status bar).

The frontend **must be served from the `car-maintenance-ui` folder**, because the pages link to each
other using absolute paths such as `/dashboard/dashboard.html`. Do not just double-click the HTML
files.

**3. Open the app:** Live Server opens your browser automatically. If it doesn't, go to
<http://127.0.0.1:5500/login-signup/login-signup.html>

You should see the login / sign-up page.

## Trying the Sprint 1 Functionality

No sample data needs to be loaded; you create your own. Suggested fictional data is given below.

1. **Sign up.** On the page, switch to **Sign Up**, enter a username (for example `demo_user`) and a
   password (for example `Demo1234`), confirm the password, and submit.
2. **Log in.** Log in with the same username and password. You are taken to the dashboard.
3. **See your vehicles.** The "My Vehicles" list is empty for a new account.
4. **Add a vehicle.** Click **Add Vehicle** and enter, for example:
   - Name: `Toyota Camry`, Year: `2018`, Color: `White`, VIN: `4T1B11HK5JU123456`

   Click **Save Vehicle**. The new card appears in the list.
5. **Add a second vehicle** (for example `Honda Civic`, `2020`, `Blue`, `2HGFC2F69LH123456`).
6. **Edit a vehicle.** Click a vehicle card. A form opens with its current values. Change something
   (for example the color) and click **Update Vehicle**. The card updates.
7. **Delete a vehicle.** Click the red **Delete** button on a card. A confirmation dialog appears;
   click **Delete** to remove the vehicle or **Cancel** to keep it.
8. **Per-user lists.** Log out, sign up as a second user, and confirm that user does not see the
   first user's vehicles.

## Known Limitations

- Vehicle lists are filtered by a `userId` sent from the browser (stored in `localStorage`). There
  is no token/session authentication, so the API is not secure against a determined user.
- The API allows requests from any origin (CORS `*`), and the backend URL
  (`http://localhost:8080`) is hard-coded in the frontend JavaScript.
- Validation is minimal: duplicate VINs are not rejected, and failed requests only show a short
  status message.
- Only the vehicle management features are implemented. Other sidebar pages (appointments, service
  history, etc.) show a "not implemented yet" message.
- The database password lives in `application.yml`; replace it with your own before running.
- Tested locally only; there is no public deployment.
