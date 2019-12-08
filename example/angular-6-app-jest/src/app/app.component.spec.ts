
import { Service } from './service';
import { AppComponent } from './app.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { autoSpy } from 'autoSpy';
import { stringify } from 'querystring'

/**
 * Test the AppComponent with test Bed -
 */
describe('AppComponent: ', () => {

    describe('Test all class method :', () => {  

        let build, builder, component: AppComponent;

        beforeEach(() => {
            // GIVEN - 
            builder = setup().default();
            build = builder.build;
            component = build();
        });   

        describe('when "getTitle()" is called', () => {
            

            
                
             

            beforeEach(() => {
                // GIVEN - 
                // builder.SERVICE.and.callThrought();
                // builder.SERVICE.and.return({});
               
            }); 

            describe('it should', () => {                 

                
                    it('DO ...', () => {
                        // GIVEN
                        

                        // WHEN - act
                        component.getTitle();

                        // THEN - assert
                        
                        // expect(builder.SERVICE).toHaveBeenCalled();
                    });

                



                /** 
                * Add more test about method getTitle
                **/
            }); // END - getTitle it should
           
        }); // END - test getTitle 

        describe('when "save()" is called', () => {
            

            
                
             

            beforeEach(() => {
                // GIVEN - 
                // builder.SERVICE.and.callThrought();
                // builder.SERVICE.and.return({});
               
            }); 

            describe('it should', () => {                 

                
                    it('DO ...', () => {
                        // GIVEN
                        

                        // WHEN - act
                        component.save();

                        // THEN - assert
                        
                        // expect(builder.SERVICE).toHaveBeenCalled();
                    });

                



                /** 
                * Add more test about method save
                **/
            }); // END - save it should
           
        }); // END - test save 

        
    }); // END - test all class method 

     describe('Test with the dom :', () => {

        let compile, builder, component: AppComponent

        beforeEach(() => {
            // GIVEN - 
            builder = setup().compile();
            compile = builder.compile;
        });

         beforeEach(() => {
            // WHEN -             
            component = compile();
        });

        it('should create', () => {
            // THEN - assert
            expect(component).toBeTruthy();
        }); 

        /**
        * Test here your DOM component
        */
        
    }); // END - Test with the dom
}); // END - test 

/**
* Setup the test, will autospy all provider 
**/
function setup() {
  const s: Service = autoSpy<Service>(Service, 'Service');
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
  const builder = {
    s,
    component,
    fixture,
    /** 
    * Confirure class, to juste create class without Domm, usefull for test class methode
    */ 
    default() {
        TestBed.configureTestingModule({
            providers: [AppComponent, { provide: Service, useValue: s }]
        });

      return builder;
    },
    /**
    * Build class to run without DOM. Will call ngOnInit if exist  
    */ 
    build() {
        component = TestBed.get(AppComponent);



        // @ts-ignore If it is a component call the ng Init before
        if (component.ngOnInit) { component.ngOnInit();   }
        return component;
    },
    /** 
    * Configure component, and compile it with DOM, usefull for test with DOM 
    **/ 
    compile() {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            providers: [{ provide: Service, useValue: s }]
        }).compileComponents();

      return builder;
    },
    /** 
    * Create component, with DOM supports
    **/     
    create() {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        return component;
    },
  };

  return builder;
}
