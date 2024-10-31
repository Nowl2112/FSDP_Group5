import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.net.URL;

public class SeleniumTest {
    public static void main(String[] args) {
        try {
            // Set Chrome options for the remote session
            ChromeOptions options = new ChromeOptions();

            // Connect to the Selenium Hub
            WebDriver driver = new RemoteWebDriver(new URL("http://192.168.68.128:4444/wd/hub"), options);

            // Run a simple test
            driver.get("https://www.Google.com");
            System.out.println("Page title is: " + driver.getTitle());

            // Close the browser
            driver.quit();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
