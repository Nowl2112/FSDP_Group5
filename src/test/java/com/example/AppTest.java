// package com.example;

// import static org.junit.jupiter.api.Assertions.assertTrue;

// import org.junit.jupiter.api.Test;

// /**
//  * Unit test for simple App.
//  */
// public class AppTest {

//     /**
//      * Rigorous Test :-)
//      */
//     @Test
//     public void shouldAnswerWithTrue() {

//     }
// }

package com.example;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class AppTest {
    private WebDriver driver;

    @BeforeEach
    public void setUp() {
        // Specify the path to ChromeDriver
        System.setProperty("webdriver.chrome.driver", "C:\\Ngee ann poly\\Year 2 sem 2\\FSDP\\chrome_driver\\chromedriver-win32\\chromedriver-win32\\chromedriver.exe");
        driver = new ChromeDriver();
    }

    @Test
    public void testGoogleHomePage() {
        driver.get("https://www.google.com");
        String title = driver.getTitle();
        assertEquals("wasd", title);
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
