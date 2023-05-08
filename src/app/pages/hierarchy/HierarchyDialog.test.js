import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import HierarchyDialog from './HierarchyDialog';
import '@testing-library/jest-dom/extend-expect';
import { createTheme, ThemeProvider } from '@mui/material/styles';

jest.mock('./Places', () => {
    return {
      __esModule: true,
      default: jest.fn(({ defaultValue, onChange }) => {
        return (
          <input
            data-testid="mocked-places"
            defaultValue={defaultValue}
            onChange={(e) => onChange && onChange(e)}
          />
        );
      }),
    };
});  

const theme = createTheme();

const defaultProps = {
  open: true,
  formValues: {
    name: '',
    surname: '',
    dob: '',
    place_of_birth: '',
    dod: '',
    gender: '',
  },
  formErrors: {},
  setFormValues: jest.fn(),
  selectedValue: '',
  setSelectedValue: jest.fn(),
  handleClose: jest.fn(),
  handleInputChange: jest.fn(),
  handleSave: jest.fn(),
  deleteNodeEdgeById: jest.fn(),
  deleteMember: jest.fn(),
  currentUser: { uid: '11111' },
  selectedNode: null,
  dialogKey: '1',
};

describe('HierarchyDialog component', () => {

    test('shows HierarchyDialog component', () => {
        render(
            <ThemeProvider theme={theme}>
                <HierarchyDialog {...defaultProps} />
            </ThemeProvider>,
        );

        const dialogTitle = screen.getByText(/Edit \/ Add data/i);
        expect(dialogTitle).toBeInTheDocument();    
    });

    test('shows form elements correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <HierarchyDialog {...defaultProps} />
            </ThemeProvider>,
        );

        const nameLabel = screen.getAllByText(/Name/i)[0];
        const surnameLabel = screen.getAllByText(/Surname/i)[0];
        const dobLabel = screen.getAllByText(/Date of Birth/i)[0];
        const placeOfBirthLabel = screen.getAllByText(/Place of Birth OR Current Location/i)[0];        
        const dodLabel = screen.getByText(/Date of Death/i);
        const genderLabel = screen.getByText(/Gender/i);   

        expect(nameLabel).toBeInTheDocument();
        expect(surnameLabel).toBeInTheDocument();
        expect(dobLabel).toBeInTheDocument();
        expect(placeOfBirthLabel).toBeInTheDocument();
        expect(dodLabel).toBeInTheDocument();
        expect(genderLabel).toBeInTheDocument();
    });

    test('shows buttons correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <HierarchyDialog {...defaultProps} />
            </ThemeProvider>,
        );

        const cancelButton = screen.getByText(/Cancel/i);
        const deleteButton = screen.getByText(/Delete Member/i);
        const saveButton = screen.getByText(/Save/i);

        expect(cancelButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
        expect(saveButton).toBeInTheDocument();
    });

    test('handles Cancel button click', () => {
        render(
            <ThemeProvider theme={theme}>
                <HierarchyDialog {...defaultProps} />
            </ThemeProvider>,
        );

        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);
        expect(defaultProps.handleClose).toHaveBeenCalled();
    });
  
    test('handles Save button click', () => {
        render(
            <ThemeProvider theme={theme}>
                <HierarchyDialog {...defaultProps} />
            </ThemeProvider>,
        );
        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);
        expect(defaultProps.handleSave).toHaveBeenCalled();
    });

    test('handles input change events', () => {
        render(
        <ThemeProvider theme={theme}>
            <HierarchyDialog {...defaultProps} />
        </ThemeProvider>,
        );

        const nameInput = screen.getByLabelText(/Name/i);
        const surnameInput = screen.getByLabelText(/Surname/i);
        const dobInput = screen.getByLabelText(/Date of Birth/i);
        const placeOfBirthInput = screen.getByTestId('mocked-places');
        const dodInput = screen.getByLabelText(/Date of Death/i);

        fireEvent.change(nameInput, { target: { value: 'Veron' } });
        fireEvent.change(surnameInput, { target: { value: 'Hoxha' } });
        fireEvent.change(dobInput, { target: { value: '2002-01-04' } });
        fireEvent.change(placeOfBirthInput, { target: { value: 'Rahovec' } });
        fireEvent.change(dodInput, { target: { value: '2070-07-20' } });

        expect(defaultProps.handleInputChange).toHaveBeenCalledTimes(5);
    });

    test('handles gender radio button change', () => {
        render(
            <ThemeProvider theme={theme}>
                <HierarchyDialog {...defaultProps} />
            </ThemeProvider>,
        );
        
        const maleRadioButton = screen.getByTestId("M");
        const femaleRadioButton = screen.getByTestId("F");
        const otherRadioButton = screen.getByTestId("O");
    
        fireEvent.click(maleRadioButton);
        fireEvent.click(femaleRadioButton);
        fireEvent.click(otherRadioButton);
    
        expect(defaultProps.setSelectedValue).toHaveBeenCalledTimes(10);
        expect(defaultProps.setFormValues).toHaveBeenCalledTimes(10);
    });
    
});