import React from 'react';
import { shallow } from 'enzyme';
import { Loader, RadioGroup } from 'nhh-styles';

import { SendCorrespondenceCompositions } from './';
import { FormWrapper, PreviewLink } from '../../components';

function sel(id) {
  return `[data-state-key="${id}"]`;
}

const templates = [
  {
    id: 'dd1bd4ba-ffbf-e811-80cf-005056825b41',
    name: 'Third Party Template',
    potentialSendingMethods: ['Sms', 'Email'],
    templatePreviewImageLink: null,
  },
  {
    id: '5ea347ea-ffbf-e811-80cf-005056825b41',
    name: 'Third Party Template - Student Lets',
    potentialSendingMethods: ['Sms', 'Email', 'Letter'],
    templatePreviewImageLink: null,
  },
];

describe('<SendCorrespondenceCompositions />', () => {
  let props;
  let el;
  const preventDefault = jest.fn();

  beforeEach(() => {
    props = {
      setTemplatePreview: jest.fn(),
      errorText: {
        noTemplateFound: 'No template found, please contact your IT help desk',
        recipient: 'Please select a recipient',
        sendingMethod: 'Please select a sendingMethod',
        template: 'Please select a template',
      },
      closeTemplate: jest.fn(),
      getTemplates: jest.fn(),
      recipients: [
        {
          name: 'Customer(s)',
          value: 'customer',
        },
        {
          name: 'Third party',
          value: 'thirdparty',
        },
      ],
      templates: [],
      templatesLoading: false,
      templatesError: false,
      labels: {
        backButton: 'back',
        closeTemplate: 'Close',
        recipient: 'Correspondence recipient',
        noTemplateFound: 'No template found',
        nextButton: 'next',
        previewTemplate: 'Preview {templateName}',
        sendingMethod: 'How do you want to contact 3rd party?',
        template: 'Select correspondence template',
      },
      onBack: jest.fn(),
      onNext: jest.fn(),
      openTemplate: jest.fn(),
      resetData: jest.fn(),
      updatePageHeader: jest.fn(),
    };

    el = shallow(<SendCorrespondenceCompositions {...props} />);
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should call updatePageHeader', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  it('should call resetData', () => {
    expect(props.resetData).toHaveBeenCalled();
  });

  it('should update the local state and call getTemplates when recipient is selected', () => {
    const selectedIndex = 0;
    const recipientRadioBox = el.find(sel('recipient'));
    const selectedRecipient = props.recipients[selectedIndex];
    recipientRadioBox.at(selectedIndex).props().onChange();
    el.update();

    expect(el.state().recipient).toEqual(selectedRecipient.name);
    expect(props.getTemplates).toHaveBeenCalledWith(selectedRecipient.value);
  });

  it('should show a <Loader /> component when templatesLoading is true and there are no templates', () => {
    el = shallow(<SendCorrespondenceCompositions {...props} templatesLoading templates={[]} />);
    expect(el.find(Loader)).toHaveLength(1);
    expect(el.find(sel('template')).length).toEqual(0);
  });

  it('should show a list of templates when supplied', () => {
    el = shallow(<SendCorrespondenceCompositions {...props} templates={templates} />);
    expect(el.find(sel('template'))).toMatchSnapshot();
  });

  it('should update the local state when a template is selected', () => {
    el = shallow(<SendCorrespondenceCompositions {...props} templates={templates} />);
    const templateRadio = el.find(sel('template'));
    templateRadio.at(0).props().onChange();
    el.update();
    expect(el.state().template).toEqual(templates[0]);
  });

  it('should call setTemplatePreview on props when template is selected', () => {
    el = shallow(<SendCorrespondenceCompositions {...props} templates={templates} />);
    const templateRadio = el.find(sel('template'));
    templateRadio.at(0).props().onChange();
    el.update();
    expect(props.setTemplatePreview).toHaveBeenCalled();
  });

  it('should show the preview template button if the template is set in the state', () => {
    el = shallow(<SendCorrespondenceCompositions {...props} templates={templates} />);
    el.setState({
      template: templates[0],
    });
    expect(el.find(PreviewLink)).toMatchSnapshot();
  });

  it('should call passed in openTemplate when preview template button is clicked', () => {
    el = shallow(<SendCorrespondenceCompositions {...props} templates={templates} />);
    el.setState({
      template: templates[0],
    });
    el.find(PreviewLink).props().onClick();

    expect(props.openTemplate).toHaveBeenCalled();
    expect(props.openTemplate.mock.calls[0][0]).toMatchSnapshot();
  });

  it('should show a list of sending methods the template is set in the state and there are sending methods to show', () => {
    el = shallow(<SendCorrespondenceCompositions {...props} templates={templates} />);
    el.setState({
      template: templates[0],
    });
    expect(el.find(sel('sendingMethod')).length).toEqual(
      templates[0].potentialSendingMethods.length
    );
    expect(el.find(sel('sendingMethod'))).toMatchSnapshot();
  });

  it('should update the local state when selecting a sendingMethod', () => {
    el = shallow(<SendCorrespondenceCompositions {...props} templates={templates} />);
    el.setState({
      template: templates[0],
    });
    const sendingMethodRadio = el.find(sel('sendingMethod'));
    sendingMethodRadio.at(0).props().onChange();
    el.update();
    expect(el.state().sendingMethod).toEqual(templates[0].potentialSendingMethods[0]);
  });

  describe('Form validations', () => {
    const submitForm = currentEl =>
      currentEl.find(FormWrapper).props().handleFormSubmit({ preventDefault });
    it('should set the correct error when recipient is not selected', () => {
      submitForm(el);
      el.update();
      expect(el.find(RadioGroup).find('[name="recipient"]').props().error).toMatchSnapshot();
      expect(props.onNext).not.toHaveBeenCalled();
    });
    it('should set the correct error when templates have loaded and one hasnt been selected', () => {
      el = shallow(<SendCorrespondenceCompositions {...props} templates={templates} />);
      submitForm(el);
      el.update();
      expect(el.find(RadioGroup).find('[name="template"]').props().error).toMatchSnapshot();
    });
    it('should set the correct error when a template is selected and sending methods are available', () => {
      el = shallow(<SendCorrespondenceCompositions {...props} templates={templates} />);
      el.setState({
        template: templates[0],
      });
      submitForm(el);
      el.update();
      expect(el.find(RadioGroup).find('[name="sendingMethod"]').props().error).toMatchSnapshot();
    });

    it('should pass validation and call the passed in onNext prop', () => {
      el = shallow(<SendCorrespondenceCompositions {...props} templates={templates} />);
      const update = {
        template: templates[0],
        recipient: props.recipients[0].name,
        sendingMethod: 'Sms',
      };
      el.setState({
        template: templates[0],
        recipient: props.recipients[0].name,
        sendingMethod: 'Sms',
      });
      submitForm(el);
      el.update();
      expect(props.onNext).toHaveBeenCalledWith(update);
    });
  });
});
