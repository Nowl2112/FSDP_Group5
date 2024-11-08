
package com.example;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.parallel.Execution;
import org.junit.jupiter.api.parallel.ExecutionMode;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;


//EIOFANSAFSJKLASKJL
@Execution(ExecutionMode.CONCURRENT)
public class AppTest2 {
    private WebDriver driver;
    @BeforeEach
    public void setUp() {
        // Specify the path to ChromeDriver

        System.setProperty("webdriver.chrome.driver", "C:\\Ngee ann poly\\Year 2 sem 2\\FSDP\\chrome_driver\\chromedriver-win32\\chromedriver-win32\\chromedriver.exe");
        
        ChromeOptions options = new ChromeOptions(); 
        options.addArguments("--headless"); 
        options.addArguments("--disable-gpu");
        
        driver = new ChromeDriver(options);

    }

    @Test //Success
    public void testGoogleHomePage() {
        driver.get("https://www.google.com");
        String title = driver.getTitle();
        assertEquals("Google", title);
        
        
    }

    @Test //Success
    public void testYoutubePage() {
        try
        {
            driver.get("https://www.youtube.com");
            String title = driver.getTitle();
            assertEquals("YouTube", title);
        }
        catch(Exception e)
        {
            System.err.println("Exception during test execution : " + e.getMessage());
        }
    }
    // @Test // Fail
    // public void testGithubPage() {
    //     try
    //     {
    //         driver.get("https://www.github.com");
    //         String title = driver.getTitle();
    //         assertEquals("GitHub", title);
    //     }
    //     catch(Exception e)
    //     {
    //         System.err.println("Exception during test execution : " + e.getMessage());
    //     }
    // }


    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}


