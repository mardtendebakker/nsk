import {
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { SyntheticEvent } from 'react';
import dynamic from 'next/dynamic';
import { EditorProps } from 'react-draft-wysiwyg';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../memoizedFormInput/TextField';
import BaseTextField from '../../textField';
import Autocomplete from '../../memoizedFormInput/Autocomplete';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false },
);

function Form({
  formRepresentation,
  disabled,
  onSubmit,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  onSubmit: (e: SyntheticEvent) => void,
  setValue: SetValue
}) {
  const { trans } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardContent>
          <Typography
            sx={{ mb: '2rem' }}
            variant="h4"
          >
            {trans('basicDetails')}
          </Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <TextField
                sx={{ flex: 0.5, mr: '1rem' }}
                // error={Boolean(formRepresentation.name.error)}
                // helperText={formRepresentation.name.error}
                label={trans('newEmailForm.name.label')}
                placeholder={trans('newEmailForm.name.placeholder')}
                name="name"
                onChange={(e) => setValue({ field: 'name', value: e.target.value })}
                // value={formRepresentation.name.value}
              />
              <TextField
                sx={{ flex: 0.5 }}
                // error={Boolean(formRepresentation.kvk_nr.error)}
                // helperText={formRepresentation.kvk_nr.error}
                label={trans('newEmailForm.subject.label')}
                placeholder={trans('newEmailForm.subject.placeholder')}
                name="subject"
                onChange={(e) => setValue({ field: 'subject', value: e.target.value })}
                // value={formRepresentation.kvk_nr.value}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <Autocomplete
                sx={{ flex: 0.5, mr: '1rem' }}
                multiple
                disabled={disabled}
                options={[]}
                filterSelectedOptions
                renderInput={
                (params) => (
                  <BaseTextField
                    {...params}
                    name="senderEmail"
                    label={trans('newEmailForm.senderEmail.label')}
                    placeholder={trans('newEmailForm.senderEmail.placeholder')}
                  />
                )
               }
              />
              <TextField
                sx={{ flex: 0.5 }}
                // error={Boolean(formRepresentation.phone.error)}
                // helperText={formRepresentation.phone.error}
                label={trans('newEmailForm.senderName.label')}
                placeholder={trans('newEmailForm.senderName.placeholder')}
                name="senderName"
                onChange={(e) => setValue({ field: 'senderName', value: e.target.value })}
                // value={formRepresentation.phone.value}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <Autocomplete
                fullWidth
                multiple
                disabled={disabled}
                options={[]}
                filterSelectedOptions
                renderInput={
                (params) => (
                  <BaseTextField
                    {...params}
                    label={trans('newEmailForm.recipients.label')}
                    placeholder={trans('newEmailForm.recipients.placeholder')}
                  />
                )
               }
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ mx: '1.5rem' }} />
        <CardContent>
          <Typography
            sx={{ mb: '2rem' }}
            variant="h4"
          >
            {trans('content')}
          </Typography>
          <Editor
            editorClassName="newCustomerEmailEditorWrapper"
          />
        </CardContent>
      </Card>
    </form>
  );
}

export default Form;
