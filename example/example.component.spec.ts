
import { Service } from './angular-6-app-jest/src/app/service';
import { ExampleComponent } from './example.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { autoSpy } from 'autoSpy';
import { stringify } from 'querystring'

/**
 * Test the ExampleComponent with test Bed -
 */
describe('ExampleComponent: ', () => {

    describe('Test all class method :', () => {  

        let build, builder, component: ExampleComponent;

        beforeEach(() => {
            // GIVEN - 
            builder = setup().default();
            build = builder.build;
            component = build();
        });   

        describe('when "aMethod()" is called', () => {
            

            
                
             let dep: string;
                let service: Object;
                

            beforeEach(() => {
                // GIVEN - 
                // builder.SERVICE.and.callThrought();
                // builder.SERVICE.and.return({});
               
            }); 

            describe('it should', () => {                 

                
                    it('DO ...', () => {
                        // GIVEN
                        dep = '';
                            service = {};
                            

                        // WHEN - act
                        component.aMethod(dep, service);

                        // THEN - assert
                        
                        // expect(builder.SERVICE).toHaveBeenCalled();
                    });

                



                /** 
                * Add more test about method aMethod
                **/
            }); // END - aMethod it should
           
        }); // END - test aMethod 

        describe('when "anotherMethod()" is called', () => {
            

            
                
             let param1: string;
                let parame2: Object;
                let param3: any;
                

            beforeEach(() => {
                // GIVEN - 
                // builder.SERVICE.and.callThrought();
                // builder.SERVICE.and.return({});
               
            }); 

            describe('it should', () => {                 

                
                    it('DO ...', () => {
                        // GIVEN
                        param1 = '';
                            parame2 = {};
                            param3 = null;
                            

                        // WHEN - act
                        component.anotherMethod(param1, parame2, param3);

                        // THEN - assert
                        expect(component.publicProperty).toEqual(null /** todo **/); // Test indirect output : this.publicProperty = true expect(component.privateProperty).toEqual(null /** todo **/); // Test indirect output : this.privateProperty = param1
                        // expect(builder.SERVICE).toHaveBeenCalled();
                    });

                



                /** 
                * Add more test about method anotherMethod
                **/
            }); // END - anotherMethod it should
           
        }); // END - test anotherMethod 

        describe('when "fourth()" is called', () => {
            

            
            let actualValue: string, expectedValue: string;
            
                
             

            beforeEach(() => {
                // GIVEN - 
                // builder.SERVICE.and.callThrought();
                // builder.SERVICE.and.return({});
               
            }); 

            describe('it should', () => {                 

                
                it('Return VALUE', () => {
                    // GIVEN 
                    

                    // WHEN - act
                    actualValue = component.fourth();

                    // THEN - assert
                    expectedValue = null;
                    expect(actualValue).toEqual(expectedValue);
                    
                    // expect(builder.SERVICE).toHaveBeenCalled();
                });
                



                /** 
                * Add more test about method fourth
                **/
            }); // END - fourth it should
           
        }); // END - test fourth 

        
    }); // END - test all class method 

     describe('Test with the dom :', () => {

        let compile, builder, component: ExampleComponent

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
  let mep:string;
const service1: Service = autoSpy<Service>(Service, 'Service');
    let component: ExampleComponent;
    let fixture: ComponentFixture<ExampleComponent>;
  const builder = {
    mep,
service1,
    component,
    fixture,
    /** 
    * Confirure class, to juste create class without Domm, usefull for test class methode
    */ 
    default() {
        TestBed.configureTestingModule({
            providers: [ExampleComponent, { provide: Service, useValue: service1 }]
        });

      return builder;
    },
    /**
    * Build class to run without DOM. Will call ngOnInit if exist  
    */ 
    build() {
        component = TestBed.get(ExampleComponent);



        // @ts-ignore If it is a component call the ng Init before
        if (component.ngOnInit) { component.ngOnInit();   }
        return component;
    },
    /** 
    * Configure component, and compile it with DOM, usefull for test with DOM 
    **/ 
    compile() {
        TestBed.configureTestingModule({
            declarations: [ExampleComponent],
            providers: [{ provide: Service, useValue: service1 }]
        }).compileComponents();

      return builder;
    },
    /** 
    * Create component, with DOM supports
    **/     
    create() {
        fixture = TestBed.createComponent(ExampleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        return component;
    },
  };

  return builder;
}
