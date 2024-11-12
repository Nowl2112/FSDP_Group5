
package com.example;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.Duration;
import java.util.List;
// import static org.junit.Assert.assertNotEquals;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.parallel.Execution;
import org.junit.jupiter.api.parallel.ExecutionMode;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.Select;
import io.github.bonigarcia.wdm.WebDriverManager;


//EIOFANSAFSJKLASKJL
@Execution(ExecutionMode.CONCURRENT)
public class AppTest {


    void wait5Seconds()
    {
        try
        {
            Thread.sleep(5000);
        }
        catch(InterruptedException e)
        {
            e.printStackTrace();
        }
    }

    void login()
    {
        driver.get("https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login");

        // Create a WebDriverWait instance
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout

        // Wait for the button to be present in the DOM
        WebElement customerLoginButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[@ng-click='customer()']")));

        // Wait for the button to be clickable
        wait.until(ExpectedConditions.elementToBeClickable(customerLoginButton));

        // Click the button
        customerLoginButton.click(); //At Customer Home Page

        WebElement nameDropDown = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"userSelect\"]")));

        wait.until(ExpectedConditions.elementToBeClickable(nameDropDown));

        Select dropDown = new Select(nameDropDown);

        dropDown.selectByIndex(1);

        WebElement selectedOption = dropDown.getFirstSelectedOption();

        WebElement loginButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/form/button")));
        wait.until(ExpectedConditions.elementToBeClickable(loginButton));
        loginButton.click();
    }

    void withdraw(String amountToWithdrawl)
    {
        login();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout

        WebElement balanceElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(" /html/body/div/div/div[2]/div/div[2]/strong[2]")));
        String balance = balanceElement.getText();

        WebElement withdrawal = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[3]/button[3]")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawal));
        withdrawal.click();

        WebElement withdrawalInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/div/input")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawalInput));
        withdrawalInput.clear();
        withdrawalInput.sendKeys(amountToWithdrawl);

        WebElement withdrawalButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/button")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawalButton));
        withdrawalButton.click();

        String newBalance = balanceElement.getText();
    }

    private WebDriver driver;
    @BeforeEach
    public void setUp() {
        // Specify the path to ChromeDriver

        // System.setProperty("webdriver.chrome.driver", "C:\\Ngee ann poly\\Year 2 sem 2\\FSDP\\chrome_driver\\chromedriver-win32\\chromedriver-win32\\chromedriver.exe");
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions(); 
        options.addArguments("--headless"); 
        options.addArguments("--disable-gpu");
        
        driver = new ChromeDriver(options);
        // driver = new ChromeDriver();


    }

    // @Test //Success
    // public void testXYZBankHomePage() {
    //     driver.get("https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login");
    //     String title = driver.getTitle();
    //     assertEquals("XYZ Bank", title);
        
    // }


    @Test
    public void testCustomerLoginButton() {
        // Navigate to the webpage
        driver.get("https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login");

        // Get the current URL
        String initialURL = driver.getCurrentUrl();

        // Create a WebDriverWait instance
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout

        // Wait for the button to be present in the DOM
        WebElement customerLoginButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[@ng-click='customer()']")));

        // Wait for the button to be clickable
        wait.until(ExpectedConditions.elementToBeClickable(customerLoginButton));

        // Click the button
        customerLoginButton.click();

        // Wait for the URL to change
        wait.until(ExpectedConditions.not(ExpectedConditions.urlToBe(initialURL)));

        // Get the new URL
        String newURL = driver.getCurrentUrl();

        // Assert that the URL has changed
        assertEquals( "https://www.globalsqa.com/angularJs-protractor/BankingProject/#/customer",newURL);
    }

    @Test
    public void testDepositing() {
        String amountToDeposit = "500";
        // Navigate to the webpage
        driver.get("https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login");

        // Create a WebDriverWait instance
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout

        // Wait for the button to be present in the DOM
        WebElement customerLoginButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[@ng-click='customer()']")));

        // Wait for the button to be clickable
        wait.until(ExpectedConditions.elementToBeClickable(customerLoginButton));

        // Click the button
        customerLoginButton.click(); //At Customer Home Page

        WebElement nameDropDown = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id=\"userSelect\"]")));

        wait.until(ExpectedConditions.elementToBeClickable(nameDropDown));

        Select dropDown = new Select(nameDropDown);

        dropDown.selectByIndex(1);

        WebElement selectedOption = dropDown.getFirstSelectedOption();

        WebElement loginButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/form/button")));
        wait.until(ExpectedConditions.elementToBeClickable(loginButton));
        loginButton.click();
        

        //After logging in

        //Getting balance
        WebElement balanceElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(" /html/body/div/div/div[2]/div/div[2]/strong[2]")));
        String balance = balanceElement.getText();

        WebElement depositButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(" /html/body/div/div/div[2]/div/div[3]/button[2]")));
        wait.until(ExpectedConditions.elementToBeClickable(depositButton));
        depositButton.click();

        WebElement depositInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/div/input")));
        wait.until(ExpectedConditions.elementToBeClickable(depositInput));
        depositInput.clear();
        depositInput.sendKeys(amountToDeposit);
        
        WebElement depositingButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/button")));
        wait.until(ExpectedConditions.elementToBeClickable(depositingButton));
        depositingButton.click();
        

        String newBalance = balanceElement.getText();


        assertEquals(Integer.parseInt(newBalance), Integer.parseInt(balance)+Integer.parseInt(amountToDeposit));
    }


    @Test
    public void testWithdrawl()
    {
        String amountToWithdrawl = "100";

        login();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout

        WebElement balanceElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(" /html/body/div/div/div[2]/div/div[2]/strong[2]")));
        String balance = balanceElement.getText();

        WebElement withdrawal = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[3]/button[3]")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawal));
        withdrawal.click();

        WebElement withdrawalInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/div/input")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawalInput));
        withdrawalInput.clear();
        withdrawalInput.sendKeys(amountToWithdrawl);

        WebElement withdrawalButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/button")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawalButton));
        withdrawalButton.click();

        String newBalance = balanceElement.getText();
        assertEquals(Integer.parseInt(newBalance), Integer.parseInt(balance)-Integer.parseInt(amountToWithdrawl));

    }

    @Test
    public void testWithdrawlMoreThanCurrentAmount()
    {
        withdraw("30000");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout
        WebElement error = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/span")));
        String errorMessage = error.getText();
        // String newBalance = String.valueOf(Integer.parseInt(balance) + 100);
        assertEquals("Transaction Failed. You can not withdraw amount more than the balance.",errorMessage);
        wait5Seconds();
    }

    @Test    
    public void testWithdrawalWithNegative()
    {
        String amountToWithdrawl = "-100";

        login();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout

        WebElement balanceElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(" /html/body/div/div/div[2]/div/div[2]/strong[2]")));
        String balance = balanceElement.getText();

        WebElement withdrawal = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[3]/button[3]")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawal));
        withdrawal.click();

        WebElement withdrawalInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/div/input")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawalInput));
        withdrawalInput.clear();
        withdrawalInput.sendKeys(amountToWithdrawl);

        WebElement withdrawalButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("/html/body/div/div/div[2]/div/div[4]/div/form/button")));
        wait.until(ExpectedConditions.elementToBeClickable(withdrawalButton));
        withdrawalButton.click();

        String newBalance = balanceElement.getText();
        assertEquals(Integer.parseInt(newBalance), Integer.parseInt(balance)); //Balance shouldn't change as input is negative

    }

    // public void transaction()
    // {

    // }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}



   

   

 
