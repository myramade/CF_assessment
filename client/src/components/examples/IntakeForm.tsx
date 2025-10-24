import IntakeForm from '../IntakeForm';

export default function IntakeFormExample() {
  return (
    <IntakeForm 
      onSubmit={(data) => console.log('Form submitted:', data)} 
    />
  );
}
